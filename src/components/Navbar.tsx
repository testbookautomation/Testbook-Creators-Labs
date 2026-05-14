"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, BookOpen, LayoutDashboard, Upload, X, Menu, CircleUserRound, LogOut } from "lucide-react";

const navLinks = [
  { href: "/",          label: "Home",        icon: Home },
  { href: "/sop",       label: "How To",      icon: BookOpen },
  { href: "/submit",    label: "Submit",      icon: Upload },
  { href: "/dashboard", label: "Dashboard",   icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen]       = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tb_user");
      if (raw) {
        const u = JSON.parse(raw);
        setLoggedIn(!!u?.loggedIn);
        setUserPhone(u?.phone ? String(u.phone).slice(-10) : "");
      } else {
        setLoggedIn(false);
        setUserPhone("");
      }
    } catch {
      setLoggedIn(false);
      setUserPhone("");
    }
  }, [pathname]);

  const closeMenus = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("tb_user");
    localStorage.removeItem("tb_submission");
    setLoggedIn(false);
    setUserPhone("");
    closeMenus();
    window.location.href = "/login";
  };

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
            <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full text-orange-700 bg-orange-50 border border-orange-100 tracking-wide uppercase">
              Creator Lab
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
          {!loggedIn && (
            <Link href="/login"
              className="hidden md:inline-flex btn-primary text-sm px-5 py-2.5 min-h-0">
              Get Started
            </Link>
          )}

          <div
            className="group relative hidden sm:block"
            onMouseEnter={() => loggedIn && setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
            onFocus={() => loggedIn && setProfileOpen(true)}
          >
            {loggedIn ? (
              <button
                type="button"
                aria-label="View profile menu"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                title={userPhone ? `Profile: +91 ${userPhone}` : "Profile"}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100"
                onClick={() => {
                  setOpen(false);
                  setProfileOpen(v => !v);
                }}
              >
                <CircleUserRound size={21} />
              </button>
            ) : (
              <Link
                href="/login"
                aria-label="Login to view profile"
                title="Profile"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                <CircleUserRound size={21} />
              </Link>
            )}

            {loggedIn && (
              <div
                role="menu"
                className={`absolute right-0 top-full w-52 pt-2 transition-all duration-150 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
                  profileOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                  {userPhone && (
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Signed in</p>
                      <p className="text-sm font-black text-slate-900">+91 {userPhone}</p>
                    </div>
                  )}
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={closeMenus}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              aria-label={loggedIn ? "View profile" : "Login to view profile"}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                loggedIn ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => {
                if (!loggedIn) {
                  window.location.href = "/login";
                  return;
                }
                setOpen(false);
                setProfileOpen(v => !v);
              }}
            >
              <CircleUserRound size={20} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
              onClick={() => {
                setProfileOpen(false);
                setOpen(v => !v);
              }} aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {profileOpen && loggedIn && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-3 py-3 space-y-1">
              {userPhone && (
                <div className="px-4 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Signed in</p>
                  <p className="text-sm font-black text-slate-900">+91 {userPhone}</p>
                </div>
              )}
              <Link href="/dashboard" onClick={closeMenus}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button type="button" onClick={logout}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-left text-[15px] font-semibold text-red-600 hover:bg-red-50">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}

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
              {!loggedIn && (
                <Link href="/login" onClick={() => setOpen(false)}
                  className="btn-primary w-full mt-2 text-[15px] py-3">
                  Get Started
                </Link>
              )}
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
