"use client";

import { MotionConfig } from "motion/react";

/** `reducedMotion="user"`: if the visitor's OS asks for less motion, Motion skips transform animations site-wide. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
