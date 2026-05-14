"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, BookOpen, LayoutDashboard, Upload, X, Menu, LogOut, User, Video } from "lucide-react";

const navLinks = [
  { href: "/",          label: "Home",      icon: Home },
  { href: "/sop",       label: "How To",    icon: BookOpen },
  { href: "/submit",    label: "Submit",    icon: Upload },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

interface UserSession { phone: string; userId: string; loggedIn: boolean; }

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open, setOpen]         = useState(false);
  const [user, setUser]         = useState<UserSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Re-read auth state on every route change
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tb_user");
      if (raw) {
        const u: UserSession = JSON.parse(raw);
        setUser(u?.loggedIn ? u : null);
      } else {
        setUser(null);
      }
    } catch { setUser(null); }
    setHydrated(true);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("tb_user");
    localStorage.removeItem("tb_submission");
    setUser(null);
    setOpen(false);
    router.push("/");
  };

  const maskedPhone = user
    ? user.phone.slice(0, 3) + "•••" + user.phone.slice(-3)
    : "";

  return (
    <>
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
            <Image
              src="/testbook-logo.png" alt="Testbook"
              width={4500} height={913} priority
              className="h-6 sm:h-7 w-auto"
            />
            <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full
              text-orange-700 bg-orange-50 border border-orange-100 tracking-wide uppercase">
              Creator
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold
                  transition-colors duration-150
                  ${pathname === href
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}>
                <Icon size={14} strokeWidth={pathname === href ? 2.5 : 2} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop right section — hidden until localStorage is read to prevent flash */}
          <div className="hidden md:flex items-center gap-2.5">
            {!hydrated ? (
              <div className="w-[108px] h-9" />
            ) : user ? (
              <>
                <div className="auth-pill">
                  <div className="auth-avatar">
                    <User size={12} />
                  </div>
                  <span className="text-[12px]">+91 {maskedPhone}</span>
                </div>
                <Link href="/submit"
                  className="btn-orange text-[13px] px-4 min-h-0 h-9 rounded-lg">
                  <Video size={13} /> Create
                </Link>
                <button onClick={logout}
                  className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-red-600
                    font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : (
              <Link href="/login"
                className="btn-primary text-[13px] px-5 min-h-0 h-9 rounded-lg">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl
              text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(v => !v)} aria-label="Menu">
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-3 py-3 space-y-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold
                    transition-colors
                    ${pathname === href
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"}`}>
                  <Icon size={17} strokeWidth={pathname === href ? 2.5 : 2} />
                  {label}
                  {pathname === href && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </Link>
              ))}

              <div className="pt-2 mt-1 border-t border-slate-100 space-y-1.5">
                {hydrated && (user ? (
                  <>
                    {/* User info */}
                    <div className="px-4 py-3 flex items-center gap-3 bg-slate-50 rounded-xl">
                      <div className="auth-avatar w-8 h-8 text-sm">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                          Logged in as
                        </p>
                        <p className="text-sm font-bold text-slate-800">+91 {user.phone}</p>
                      </div>
                    </div>
                    {/* Create CTA */}
                    <Link href="/submit" onClick={() => setOpen(false)}
                      className="btn-orange w-full text-[15px] py-3 rounded-xl">
                      <Video size={17} /> Create a Video
                    </Link>
                    {/* Logout */}
                    <button onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                        text-[15px] font-semibold text-slate-500 hover:text-red-600
                        hover:bg-red-50 transition-colors">
                      <LogOut size={17} /> Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)}
                    className="btn-primary w-full text-[15px] py-3">
                    Get Started
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl
        border-t border-slate-200/70 safe-bottom">
        <div className="grid grid-cols-4 h-16">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className="flex flex-col items-center justify-center gap-0.5 transition-colors">
                <div className={`flex items-center justify-center w-8 h-7 rounded-lg transition-all
                  ${active ? "bg-blue-100" : ""}`}>
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.5 : 1.8}
                    className={active ? "text-blue-700" : "text-slate-400"}
                  />
                </div>
                <span className={`text-[10px] font-semibold
                  ${active ? "text-blue-700" : "text-slate-400"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
