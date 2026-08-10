import { verifyActivationToken } from "@/lib/activation";
import { ActivateForm } from "./ActivateForm";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default async function ActivatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const check = await verifyActivationToken(token);

  if (!check.valid) {
    const messages: Record<string, string> = {
      not_found: "This activation link isn't valid.",
      used: "This activation link has already been used.",
      expired: "This activation link has expired.",
    };

    return (
      <div className="enamel-grid flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-white to-bg px-5">
        <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm shadow-slate-900/5">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-danger">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-xl font-extrabold text-text">
            {messages[check.reason]}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Request a fresh activation link from the login page.
          </p>
          <Link
            href="/patient/login"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return <ActivateForm token={token} />;
}
