"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpIcon } from "lucide-react";
import { useLenis } from "lenis/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Floating button that appears once the visitor has scrolled past the first screen. */
export default function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const lenis = useLenis();
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 0.9));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed z-30"
          style={{ right: "max(16px, env(safe-area-inset-right))", bottom: "max(16px, env(safe-area-inset-bottom))" }}
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="size-11 rounded-full bg-card shadow-lg hover:border-[var(--accent)] hover:text-[var(--accent-ink)]"
                aria-label="Back to top"
                onClick={() =>
                  lenis
                    ? lenis.scrollTo(0, { duration: 1.4 })
                    : window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
                }
              >
                <ArrowUpIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Back to top</TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
