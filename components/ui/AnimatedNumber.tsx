"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Counts up a numeric prefix (e.g. "40,000" in "40,000+") once the element
 * scrolls into view. Non-numeric prefix/suffix characters are preserved.
 */
export function AnimatedNumber({ value }: { value: string }) {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(match ? match[1] + "0" + match[3] : value);

  useEffect(() => {
    if (!match || !inView) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr.replace(/,/g, ""), 10);

    if (shouldReduceMotion) {
      setDisplay(prefix + numStr + suffix);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(prefix + current.toLocaleString() + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return <span ref={ref}>{display}</span>;
}
