"use client";

import { motion, type HTMLMotionProps } from "motion/react";

const tags = { div: motion.div, article: motion.article, li: motion.li, p: motion.p } as const;

type Props = HTMLMotionProps<"div"> & {
  as?: keyof typeof tags;
  delay?: number;
  /** distance in px the element rises while fading in */
  y?: number;
};

/** Fades and lifts its content in the first time it scrolls into view. */
export default function Reveal({ as = "div", delay = 0, y = 24, children, ...rest }: Props) {
  const Tag = tags[as] as typeof motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
