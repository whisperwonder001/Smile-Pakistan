"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, ShieldCheck } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function Hero() {
  return (
    <section className="enamel-grid relative overflow-hidden bg-gradient-to-b from-white to-bg">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2000&q=60"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/70 to-bg" />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary-dark"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Digital diagnostics, every visit
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-text sm:text-5xl lg:text-6xl"
          >
            Precision dental care,
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              built around your smile
            </span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
          >
            From routine scaling to full smile makeovers, every treatment
            plan at Smile Pakistan starts with a digital X-ray and a
            conversation — not a guess.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              <CalendarCheck className="h-4 w-4" />
              Book an Appointment
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-text transition-colors hover:border-primary/40 hover:text-primary"
            >
              Explore Treatments
            </Link>
          </motion.div>
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted"
          >
            <span>3 branches — Lahore, Karachi, Islamabad</span>
            <span className="hidden sm:inline">•</span>
            <span>PKR-based transparent pricing</span>
            <span className="hidden sm:inline">•</span>
            <span>Same-day emergency slots</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] as const }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="scan-line rounded-[2rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-900/5">
            <svg
              viewBox="0 0 240 260"
              className="h-auto w-full"
              role="img"
              aria-label="Illustrative cross-section diagram of a molar tooth, used as a decorative diagnostic motif"
            >
              <defs>
                <linearGradient id="enamelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
              </defs>
              <path
                d="M40 60 C40 20 90 8 120 8 C150 8 200 20 200 60 C200 90 185 95 178 120 C172 145 168 175 160 200 C154 220 146 232 136 232 C124 232 122 190 120 165 C118 190 116 232 104 232 C94 232 86 220 80 200 C72 175 68 145 62 120 C55 95 40 90 40 60Z"
                fill="url(#enamelGrad)"
                stroke="#0EA5E9"
                strokeWidth="1.5"
              />
              <path
                d="M70 65 C70 40 95 30 120 30 C145 30 170 40 170 65 C170 85 158 92 150 105 C140 90 130 82 120 82 C110 82 100 90 90 105 C82 92 70 85 70 65Z"
                fill="#ffffff"
                stroke="#2563EB"
                strokeWidth="1"
                opacity="0.8"
              />
              <circle cx="120" cy="60" r="6" fill="#14B8A6" opacity="0.6" />
              <line
                x1="20"
                y1="130"
                x2="220"
                y2="130"
                stroke="#0EA5E9"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              <text
                x="20"
                y="122"
                fontSize="9"
                fill="#64748B"
                fontFamily="var(--font-body)"
              >
                Enamel · Dentin · Pulp mapped digitally
              </text>
            </svg>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            className="absolute -bottom-6 -left-6 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-xl shadow-slate-900/5"
          >
            <p className="font-display text-2xl font-extrabold text-primary">98%</p>
            <p className="text-xs text-muted">patient satisfaction, 2025</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
