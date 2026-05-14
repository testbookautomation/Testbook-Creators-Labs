"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5
        rounded-lg transition-all duration-200
        ${copied
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          : "bg-white/10 text-slate-300 border border-white/15 hover:bg-white/20 hover:text-white"
        }`}>
      {copied
        ? <><Check size={12} /> Copied!</>
        : <><Copy size={12} /> Copy caption</>}
    </button>
  );
}
