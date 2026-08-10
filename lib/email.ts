import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

/**
 * Real email sending, gated on RESEND_API_KEY being set.
 *
 * This is genuinely wired up — not a stub — but it needs a Resend account
 * and a verified sending domain to actually deliver mail. Get an API key
 * at https://resend.com, set RESEND_API_KEY and EMAIL_FROM in .env, and
 * mail will start sending on the very next call with no code changes.
 *
 * Without a key, sendEmail() logs to the console and returns
 * { sent: false, reason: "not_configured" } instead of throwing, so the
 * rest of the app (booking, status updates) keeps working in dev/demo
 * environments that don't have Resend set up.
 *
 * SMS and WhatsApp are NOT implemented here — per the architecture doc's
 * gaps section, JazzCash/EasyPaisa-adjacent SMS gateways and the WhatsApp
 * Business API both require merchant/Meta verification that takes days to
 * weeks to provision, so they stay out of scope until those accounts
 * exist. The `Notification.channel` field already supports "sms" and
 * "whatsapp" for when that's ready — only "email" and "browser" currently
 * do anything.
 */

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_ADDRESS = process.env.EMAIL_FROM || "Smile Pakistan <onboarding@resend.dev>";

type SendEmailResult =
  | { sent: true }
  | { sent: false; reason: "not_configured" | "send_failed"; error?: unknown };

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  if (!resend) {
    console.log(
      `[email:not-configured] Would send "${input.subject}" to ${input.to}. Set RESEND_API_KEY to actually deliver mail.`
    );
    return { sent: false, reason: "not_configured" };
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
    return { sent: true };
  } catch (error) {
    console.error("[email:send_failed]", error);
    return { sent: false, reason: "send_failed", error };
  }
}

/**
 * Creates a persistent in-app Notification row (visible in the portals)
 * and, when channel is "email", also attempts real delivery via
 * sendEmail(). Call this instead of writing to prisma.notification
 * directly so every notification gets both the in-app record and, where
 * applicable, a real send attempt.
 */
export async function notifyUser(input: {
  userId: string;
  email?: string;
  title: string;
  body: string;
  channel?: "email" | "browser";
  emailHtml?: string;
}) {
  const channel = input.channel ?? "email";

  await prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      body: input.body,
      channel,
    },
  });

  if (channel === "email" && input.email) {
    return sendEmail({
      to: input.email,
      subject: input.title,
      html: input.emailHtml || simpleEmailLayout(input.title, input.body),
    });
  }

  return { sent: false, reason: "not_configured" as const };
}

function simpleEmailLayout(title: string, body: string) {
  return `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
      <p style="font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; color: #0d9488; font-weight: 700; margin-bottom: 16px;">
        Smile Pakistan
      </p>
      <h1 style="font-size: 20px; margin: 0 0 12px;">${escapeHtml(title)}</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #374151;">${escapeHtml(body)}</p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">
        This is an automated message from Smile Pakistan. Please don't reply directly to this email.
      </p>
    </div>
  `;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
