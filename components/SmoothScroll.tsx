"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import "lenis/dist/lenis.css";

/** Fast start, long soft landing — the "glide" of the scroll. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Smooth (inertial) scrolling for mouse wheel and trackpad via Lenis.
 * The page still scrolls natively underneath (window.scrollY is real), so Motion's useScroll,
 * IntersectionObservers and sticky elements keep working. Touch screens keep native scrolling.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: easeOutExpo,
        smoothWheel: !reduce, // "reduce motion" → plain scrolling
        // <a href="#section"> links glide too. Lenis honours each target's CSS scroll-margin-top,
        // which already leaves room for the sticky topbar, so no extra offset here.
        anchors: true,
        allowNestedScroll: true, // inner scrollers (network graph on mobile, ⌘K list) scroll themselves
        prevent: (node) => !!node.closest?.("[role=dialog]"),
      }}
    >
      <PauseWhileDialogOpen />
      {children}
    </ReactLenis>
  );
}

/** Radix marks <body data-scroll-locked> while a dialog is open; stop gliding the page behind it. */
function PauseWhileDialogOpen() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const sync = () => (document.body.hasAttribute("data-scroll-locked") ? lenis.stop() : lenis.start());
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] });
    sync();
    return () => mo.disconnect();
  }, [lenis]);
  return null;
}
