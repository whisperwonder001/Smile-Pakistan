"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { issueActivation, verifyActivationToken, consumeActivationToken } from "@/lib/activation";

/**
 * Requests (or re-sends) an activation email for an account that hasn't
 * set a real password yet. Deliberately returns the same generic message
 * whether or not the email matches an account, and whether or not it's
 * already activated — this endpoint is public and unauthenticated, so it
 * shouldn't leak which emails exist in the system.
 */
export async function requestActivationEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return { message: "If that email has an account awaiting activation, we've sent a link." };
  }

  const user = await prisma.user.findUnique({ where: { email: normalized } });

  // emailVerified doubles as "has this account ever set a real password" —
  // only re-issue a link for accounts that haven't activated yet, so this
  // can't be used to force a password reset on an already-active account.
  if (user && !user.emailVerified) {
    await issueActivation({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
  }

  return { message: "If that email has an account awaiting activation, we've sent a link." };
}

export async function activateAccount(rawToken: string, password: string) {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const check = await verifyActivationToken(rawToken);
  if (!check.valid) {
    const messages: Record<string, string> = {
      not_found: "This activation link isn't valid.",
      used: "This activation link has already been used.",
      expired: "This activation link has expired — request a new one from the login page.",
    };
    throw new Error(messages[check.reason]);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: check.userId },
    data: { passwordHash, emailVerified: new Date() },
  });
  await consumeActivationToken(check.tokenHash);

  const user = await prisma.user.findUnique({ where: { id: check.userId } });
  const loginPath =
    user?.role === "DOCTOR"
      ? "/doctor/login"
      : user?.role === "ADMIN" || user?.role === "RECEPTIONIST"
      ? "/admin/login"
      : "/patient/login";

  return { loginPath };
}
