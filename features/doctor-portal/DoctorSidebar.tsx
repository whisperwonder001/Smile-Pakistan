"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, CalendarDays, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/doctor/dashboard", label: "Today's Schedule", icon: LayoutDashboard },
  { href: "/doctor/patients", label: "Patients", icon: Users },
  { href: "/doctor/appointments", label: "Appointments", icon: CalendarDays },
];

export function DoctorSidebar({
  fullName,
  specialty,
}: {
  fullName: string;
  specialty: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-100 bg-white p-5 lg:w-64 lg:shrink-0">
      <div className="flex items-center gap-2.5 px-1">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 font-display text-sm font-bold text-primary-dark">
          {fullName
            .split(" ")
            .slice(1)
            .map((w) => w[0])
            .join("")}
        </span>
        <div>
          <p className="font-display text-sm font-bold text-text">{fullName}</p>
          <p className="text-xs text-muted">{specialty}</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary-dark"
                  : "text-text/70 hover:bg-slate-50 hover:text-text"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/doctor/login" })}
        className="mt-4 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-danger/80 transition-colors hover:bg-danger/5"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}
