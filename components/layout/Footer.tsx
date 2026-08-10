import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const columns = [
  {
    title: "Treatments",
    links: [
      "Dental Implants",
      "Teeth Whitening",
      "Braces",
      "Root Canal Treatment",
      "Smile Makeover",
    ],
  },
  {
    title: "Patients",
    links: ["Book Appointment", "Pricing", "Before & After", "FAQ", "Patient Portal"],
  },
  {
    title: "Practice",
    links: ["About", "Our Team", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-display font-bold text-sm">
                SP
              </span>
              <span className="font-display text-lg font-bold text-text">
                Smile Pakistan
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Premium dental care across Lahore, Karachi and Islamabad — built
              on digital diagnostics and gentle, modern treatment.
            </p>
            <div className="mt-5 space-y-2 text-sm text-text/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>Gulberg III, Lahore, Punjab</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+92 42 1123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>hello@smilepakistan.pk</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>Mon–Sat, 10:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-display text-sm font-semibold text-text">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-muted hover:text-primary"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Smile Pakistan. All rights reserved.
          </p>
          <p className="text-xs text-muted">PMDC-registered practitioners</p>
        </div>
      </div>
    </footer>
  );
}
