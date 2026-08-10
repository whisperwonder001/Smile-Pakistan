"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const serviceGroups = [
  {
    label: "Restorative",
    items: ["Dental Fillings", "Root Canal Treatment", "Crowns", "Bridges", "Dentures"],
  },
  {
    label: "Cosmetic",
    items: ["Teeth Whitening", "Veneers", "Smile Makeover", "Clear Aligners"],
  },
  {
    label: "Surgical & Preventive",
    items: [
      "Dental Implants",
      "Wisdom Tooth Extraction",
      "Oral Surgery",
      "Scaling & Polishing",
      "Preventive Dentistry",
    ],
  },
  {
    label: "Family & Diagnostics",
    items: ["Braces", "Pediatric Dentistry", "Emergency Dentistry", "Digital X-rays"],
  },
];

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", mega: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Before & After", href: "/before-after" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(15,23,42,0.06)]"
          : "bg-white/60 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-display font-bold text-sm shadow-sm">
            SP
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-text">
            Smile Pakistan
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            link.mega ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-text/80 transition-colors hover:bg-primary/5 hover:text-primary">
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3"
                  >
                    <div className="grid grid-cols-4 gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5">
                      {serviceGroups.map((group) => (
                        <div key={group.label}>
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                            {group.label}
                          </p>
                          <ul className="space-y-2">
                            {group.items.map((item) => (
                              <li key={item}>
                                <Link
                                  href={`/services/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="text-sm text-text/80 hover:text-primary"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-text/80 transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+924211234567"
            className="text-sm font-medium text-text/70 hover:text-primary"
          >
            +92 42 1123 4567
          </a>
          <Link
            href="/book-appointment"
            className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Book Appointment
          </Link>
        </div>

        <button
          className="lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text/80 hover:bg-primary/5 hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/book-appointment"
                className="mt-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                Book Appointment
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
