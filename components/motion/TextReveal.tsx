"use client";

import { motion } from "motion/react";

const letter = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0.7, ease: [0.2, 0.75, 0.2, 1] as const } },
};

/** Letters rise one by one out of a clipped line. Screen readers get the plain text from an sr-only copy. */
export default function TextReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
      style={{ display: "block", overflow: "hidden", // padding keeps descenders (the g in Gandrung) inside the clip; the negative margin cancels it out
        paddingBottom: "0.2em", marginBottom: "-0.2em" }}
    >
      <span className="sr-only">{text}</span>
      {[...text].map((ch, i) => (
        <motion.span key={i} aria-hidden="true" variants={letter} style={{ display: "inline-block", willChange: "transform" }}>
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}
