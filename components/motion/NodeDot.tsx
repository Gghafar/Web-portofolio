"use client";

import { motion } from "motion/react";

/** The orange dot after the name: springs in, then breathes slowly like a live node. */
export default function NodeDot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="node"
      aria-hidden="true"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.35, 1] }}
      transition={{ delay, duration: 0.6, times: [0, 0.6, 1], ease: "easeOut" }}
    >
      <motion.span
        style={{ display: "block", width: "100%", height: "100%", borderRadius: "50%", background: "inherit" }}
        animate={{ boxShadow: ["0 0 0 0em var(--accent-soft)", "0 0 0 .09em var(--accent-soft)", "0 0 0 0em var(--accent-soft)"] }}
        transition={{ delay: delay + 0.6, duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.span>
  );
}
