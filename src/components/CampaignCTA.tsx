"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Play, LayoutDashboard, Upload, LogIn } from "lucide-react";

function useAuthTarget(): "/login" | "/submit" | "/dashboard" {
  const [target, setTarget] = useState<"/login" | "/submit" | "/dashboard">("/login");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tb_user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.loggedIn) {
          const sub = localStorage.getItem("tb_submission");
          setTarget(sub ? "/dashboard" : "/submit");
          return;
        }
      }
    } catch { /* ignore */ }
    setTarget("/login");
  }, []);

  return target;
}

/** Hero section primary + secondary CTA */
export function HeroCTA() {
  const target   = useAuthTarget();
  const loggedIn = target !== "/login";

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-7 sm:mt-9">
      <Link href={target} className="btn-orange text-base px-7 w-full sm:w-auto">
        {loggedIn
          ? target === "/dashboard" ? "Go to Dashboard" : "Submit Video"
          : "Start campaign"}
        <ArrowRight size={18} />
      </Link>
      <Link href="/sop"
        className="inline-flex items-center justify-center gap-2 min-h-[48px]
          rounded-lg border border-white/25 bg-white/8 px-7 text-base font-semibold
          text-white transition hover:bg-white/15 hover:border-white/50
          w-full sm:w-auto">
        <Play size={16} /> View Guide
      </Link>
    </div>
  );
}

/** Bottom page CTA button (homepage) */
export function BottomCTA() {
  const target   = useAuthTarget();
  const loggedIn = target !== "/login";

  return (
    <Link href={target} className="btn-orange text-base px-10 py-4 inline-flex">
      {loggedIn ? (
        <>
          <LayoutDashboard size={18} />
          {target === "/dashboard" ? "Go to Dashboard" : "Submit Your Video"}
        </>
      ) : (
        <>Join the campaign <ArrowRight size={18} /></>
      )}
    </Link>
  );
}

/** SOP page bottom CTA — shows submit or login depending on auth state */
export function SopCTA() {
  const target   = useAuthTarget();
  const loggedIn = target !== "/login";

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={loggedIn ? target : "/submit"}
        className="btn-orange text-[15px] py-3.5 w-full">
        <Upload size={17} />
        {loggedIn
          ? target === "/dashboard" ? "View My Dashboard" : "Submit Your Video"
          : "Submit Your Video"}
      </Link>
      {!loggedIn && (
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 min-h-[48px]
            rounded-lg border border-white/30 bg-white/8 text-white font-semibold
            text-[15px] py-3.5 transition hover:bg-white/15 hover:border-white/50">
          <LogIn size={17} /> Login First
        </Link>
      )}
    </div>
  );
}
