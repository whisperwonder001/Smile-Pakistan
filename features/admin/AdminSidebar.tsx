"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Building2,
  Receipt,
  Newspaper,
  Quote,
  HelpCircle,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    links: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    links: [
      { href: "/admin/appointments", label: "Appointments", icon: CalendarDays },
      { href: "/admin/patients", label: "Patients", icon: Users },
      { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
      { href: "/admin/branches", label: "Branches", icon: Building2 },
      { href: "/admin/billing", label: "Billing", icon: Receipt },
    ],
  },
  {
    label: "Website CMS",
    links: [
      { href: "/admin/cms/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/cms/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/cms/faqs", label: "FAQs", icon: HelpCircle },
    ],
  },
];

const adminOnlyGroup = {
  label: "Settings",
  links: [{ href: "/admin/roles", label: "Roles & Permissions", icon: ShieldCheck }],
};

export function AdminSidebar({ fullName, role }: { fullName: string; role: string }) {
  const pathname = usePathname();
  const groups = role === "ADMIN" ? [...navGroups, adminOnlyGroup] : navGroups;

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-100 bg-white p-5 lg:w-64 lg:shrink-0">
      <div className="flex items-center gap-2.5 px-1">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 font-display text-sm font-bold text-primary-dark">
          {fullName.split(" ").map((w) => w[0]).join("")}
        </span>
        <div>
          <p className="font-display text-sm font-bold text-text">{fullName}</p>
          <p className="text-xs text-muted capitalize">{role.toLowerCase()}</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-5 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {group.label}
            </p>
            <div className="mt-1.5 flex flex-col gap-1">
              {group.links.map((link) => {
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
            </div>
          </div>
        ))}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-4 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-danger/80 transition-colors hover:bg-danger/5"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}
