import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const TOKEN_TTL_HOURS = 48;

function hashToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

function baseUrl() {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

/**
 * Issues a fresh activation token for a user and emails them a set-password
 * link. Any previously-issued, still-unused tokens for that user are
 * invalidated first, so only the most recently sent link works — avoids a
 * stale earlier email being usable after someone requests a new one.
 *
 * Used for both booking-wizard patients and admin-created doctors, who both
 * start with a random unusable password hash and need this to ever log in.
 */
export async function issueActivation(user: {
  id: string;
  email: string;
  fullName: string;
  role: "PATIENT" | "DOCTOR" | "RECEPTIONIST" | "ADMIN";
}) {
  await prisma.accountActivationToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() }, // mark superseded tokens as used so they can't be replayed
  });

  const rawToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await prisma.accountActivationToken.create({
    data: { userId: user.id, tokenHash: hashToken(rawToken), expiresAt },
  });

  const link = `${baseUrl()}/activate/${rawToken}`;
  const loginPath =
    user.role === "DOCTOR" ? "/doctor/login" : user.role === "ADMIN" || user.role === "RECEPTIONIST" ? "/admin/login" : "/patient/login";

  const result = await sendEmail({
    to: user.email,
    subject: "Set your Smile Pakistan password",
    html: `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
        <p style="font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; color: #0d9488; font-weight: 700; margin-bottom: 16px;">
          Smile Pakistan
        </p>
        <h1 style="font-size: 20px; margin: 0 0 12px;">Welcome, ${escapeHtml(user.fullName)}</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #374151;">
          Set a password to activate your account and sign in.
        </p>
        <a href="${link}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background: #0d9488; color: #fff; text-decoration: none; border-radius: 999px; font-size: 14px; font-weight: 600;">
          Set your password
        </a>
        <p style="font-size: 12px; color: #9ca3af;">
          This link expires in ${TOKEN_TTL_HOURS} hours. If it expires, you can request a new one from the ${loginPath.includes("doctor") ? "doctor" : loginPath.includes("admin") ? "staff" : "patient"} login page.
        </p>
      </div>
    `,
  });

  return { rawToken, ...result };
}

type VerifyResult =
  | { valid: true; userId: string; tokenHash: string }
  | { valid: false; reason: "not_found" | "expired" | "used" };

export async function verifyActivationToken(rawToken: string): Promise<VerifyResult> {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.accountActivationToken.findUnique({ where: { tokenHash } });

  if (!record) return { valid: false, reason: "not_found" };
  if (record.usedAt) return { valid: false, reason: "used" };
  if (record.expiresAt < new Date()) return { valid: false, reason: "expired" };

  return { valid: true, userId: record.userId, tokenHash };
}

export async function consumeActivationToken(tokenHash: string) {
  await prisma.accountActivationToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
