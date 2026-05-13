"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, BookOpen, LayoutDashboard, Upload, X, Menu } from "lucide-react";

const navLinks = [
  { href: "/",          label: "Home",        icon: Home },
  { href: "/sop",       label: "How To",      icon: BookOpen },
  { href: "/submit",    label: "Submit",      icon: Upload },
  { href: "/dashboard", label: "Dashboard",   icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
            <Image
              src="/testbook-logo.png"
              alt="Testbook"
              width={4500}
              height={913}
              priority
              className="h-6 sm:h-7 w-auto"
            />
            <span className="hidden sm:inline-flex text-[11px] font-bold px-2 py-1 rounded-full text-orange-700 bg-orange-50 border border-orange-100">
              Creator
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors
                  ${pathname === href ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"}`}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link href="/login"
            className="hidden md:inline-flex btn-primary text-sm px-5 py-2.5 min-h-0">
            Get Started
          </Link>

          {/* Mobile burger */}
          <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
            onClick={() => setOpen(v => !v)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-3 py-3 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold transition-colors
                    ${pathname === href ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}>
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setOpen(false)}
                className="btn-primary w-full mt-2 text-[15px] py-3">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 safe-bottom">
        <div className="grid grid-cols-4 h-16">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors
                  ${active ? "text-blue-700" : "text-slate-400"}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
