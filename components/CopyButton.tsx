"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { CheckIcon, CopyIcon } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

/** Copies `text`; if the clipboard API is unavailable, selects the element `targetId` so the visitor can copy by hand. */
export default function CopyButton({ text, targetId, label = "Copy email" }: { text: string; targetId: string; label?: string }) {
  const [msg, setMsg] = useState(label);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const done = (m: string, ok: boolean) => {
    setMsg(m);
    setCopied(ok);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMsg(label);
      setCopied(false);
    }, 1800);
  };
  const fallback = () => {
    const t = document.getElementById(targetId);
    const s = getSelection();
    if (t && s) {
      const r = document.createRange();
      r.selectNodeContents(t);
      s.removeAllRanges();
      s.addRange(r);
    }
    done("Selected, press Ctrl+C", false);
  };
  const success = () => {
    done("Copied", true);
    toast.success("Email copied", { description: text });
  };

  return (
    <LiquidButton
      type="button"
      size="lg"
      className="rounded-full font-semibold"
      onClick={() => {
        try {
          navigator.clipboard.writeText(text).then(success, fallback);
        } catch {
          fallback();
        }
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: "inline-flex" }}
          aria-hidden="true"
        >
          {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
        </motion.span>
      </AnimatePresence>
      <span className="bl">{msg}</span>
    </LiquidButton>
  );
}
