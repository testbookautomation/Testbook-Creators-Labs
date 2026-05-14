"use client";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Phone, ShieldCheck, ArrowLeft, RefreshCw, AlertTriangle,
  CheckCircle, ExternalLink, Loader2, ArrowRight, Lock, Zap,
} from "lucide-react";
import { trackEvent, EV } from "@/lib/api";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone]               = useState("");
  const [userId, setUserId]             = useState("");
  const [step, setStep]                 = useState<"phone" | "otp" | "success">("phone");
  const [otp, setOtp]                   = useState(["", "", "", ""]);
  const [timer, setTimer]               = useState(30);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [notRegistered, setNotRegistered] = useState(false);

  const refs = [
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
  ];

  // Redirect if already logged in
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tb_user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.loggedIn) { router.replace("/dashboard"); return; }
      }
    } catch { /* ignore */ }

    const p = searchParams.get("phone") || "";
    const u = searchParams.get("userid") || "";
    if (p) setPhone(p.replace(/^(\+?91)?/, "").slice(0, 10));
    if (u) setUserId(u);
  }, [searchParams, router]);

  // OTP countdown timer
  useEffect(() => {
    if (step !== "otp" || timer === 0) return;
    const t = setTimeout(() => setTimer(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const sendOtp = async () => {
    setError("");
    if (phone.length < 10) { setError("Enter a valid 10-digit phone number."); return; }
    setLoading(true);
    trackEvent({ eventName: EV.OTP_REQUESTED, phone, userId, page: "/login" });
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep("otp");
    setTimer(30);
    setOtp(["", "", "", ""]);
    setTimeout(() => refs[0].current?.focus(), 80);
  };

  const handleOtpInput = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val;
    setOtp(next);
    if (val && i < 3) refs[i + 1].current?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs[i - 1].current?.focus();
    if (e.key === "Enter") verifyOtp();
  };

  const verifyOtp = async () => {
    setError("");
    const code = otp.join("");
    if (code.length < 4) { setError("Enter the complete 4-digit OTP."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (code === "0000") { setStep("phone"); setNotRegistered(true); return; }
    localStorage.setItem("tb_user", JSON.stringify({ phone, userId, loggedIn: true }));
    trackEvent({ eventName: EV.OTP_VERIFIED, phone, userId, page: "/login" });
    setStep("success");
    setTimeout(() => router.push("/sop"), 1400);
  };

  const resendOtp = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setTimer(30);
    setOtp(["", "", "", ""]);
  };

  const stepIdx = step === "phone" ? 0 : step === "otp" ? 1 : 2;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-sm">

          {/* Step progress */}
          {step !== "success" && (
            <div className="flex items-center gap-1 mb-7">
              {(["Phone", "Verify"] as const).map((label, i) => {
                const done   = i < stepIdx;
                const active = i === stepIdx;
                return (
                  <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center
                      text-[11px] font-black shrink-0 transition-all duration-200
                      ${done ? "bg-emerald-500 text-white"
                        : active ? "bg-blue-700 text-white"
                        : "bg-slate-200 text-slate-400"}`}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs font-semibold transition-colors
                      ${active ? "text-slate-900" : done ? "text-emerald-600" : "text-slate-400"}`}>
                      {label}
                    </span>
                    {i === 0 && (
                      <div className={`flex-1 h-px mx-1 transition-colors
                        ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Main card */}
          <div className="card-premium overflow-hidden">

            {/* Card header gradient */}
            <div className="tb-gradient px-6 pt-7 pb-6 text-white text-center">
              <div className="inline-flex bg-white/15 rounded-2xl px-5 py-2.5 mx-auto mb-4">
                <Image
                  src="/testbook-logo.png" alt="Testbook"
                  width={4500} height={913} className="h-7 w-auto"
                />
              </div>
              <h1 className="text-[15px] font-black tracking-tight">Student Creator Login</h1>
              <p className="text-blue-200 text-xs mt-1 font-medium">
                {step === "phone"
                  ? "Verify your Testbook account to continue"
                  : step === "otp"
                  ? `OTP sent to +91 ${phone}`
                  : "You're verified!"}
              </p>
            </div>

            {/* Card body */}
            <div className="px-6 py-6">

              {/* ── PHONE STEP ── */}
              {step === "phone" && (
                <div className="fade-up">
                  {notRegistered && (
                    <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex gap-2 mb-1.5">
                        <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-amber-800 font-bold text-sm">Account not found</p>
                      </div>
                      <p className="text-amber-700 text-xs leading-relaxed mb-3">
                        Create a Testbook account with this number first, then return here.
                      </p>
                      <a href="https://testbook.com" target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline">
                        Go to Testbook <ExternalLink size={11} />
                      </a>
                    </div>
                  )}

                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Mobile Number
                  </label>
                  <div className={`input-field flex items-center p-0 overflow-hidden
                    ${error ? "error" : ""}`}>
                    <span className="flex items-center gap-1.5 px-3.5 py-3 text-slate-500
                      text-sm font-bold bg-slate-50 border-r border-slate-200 shrink-0 self-stretch">
                      <Phone size={13} /> +91
                    </span>
                    <input
                      type="tel" value={phone} maxLength={10}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onKeyDown={e => e.key === "Enter" && sendOtp()}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 text-slate-900 text-[15px] bg-white
                        outline-none min-h-0 font-medium tracking-wide"
                    />
                  </div>

                  {userId && (
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <ShieldCheck size={11} className="text-emerald-500" />
                      Testbook ID detected: {userId}
                    </p>
                  )}
                  {error && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertTriangle size={11} /> {error}
                    </p>
                  )}

                  <button onClick={sendOtp} disabled={loading} className="btn-primary w-full mt-4">
                    {loading
                      ? <><Loader2 size={16} className="spinner" /> Sending OTP…</>
                      : <>Send OTP <ArrowRight size={16} /></>}
                  </button>

                  {/* Trust indicators */}
                  <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    {[
                      { icon: Lock,       label: "Secure OTP" },
                      { icon: Zap,        label: "Instant verify" },
                      { icon: ShieldCheck, label: "TB-linked" },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Icon size={14} className="text-blue-600" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold leading-tight">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── OTP STEP ── */}
              {step === "otp" && (
                <div className="fade-up">
                  <button
                    onClick={() => { setStep("phone"); setError(""); }}
                    className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold
                      mb-5 hover:text-slate-800 transition-colors">
                    <ArrowLeft size={14} /> Back
                  </button>

                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Enter the 4-digit OTP sent to{" "}
                    <strong className="text-slate-900">+91 {phone}</strong>
                  </p>

                  {/* OTP inputs */}
                  <div className="flex gap-3 justify-center mb-3">
                    {otp.map((d, i) => (
                      <input
                        key={i} ref={refs[i]} type="text" inputMode="numeric"
                        value={d} maxLength={1}
                        onChange={e => handleOtpInput(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        className={`otp-box ${d ? "filled" : ""}`}
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="text-red-500 text-xs text-center mb-3 flex items-center
                      justify-center gap-1">
                      <AlertTriangle size={11} /> {error}
                    </p>
                  )}

                  <div className="text-center text-sm my-4">
                    {timer > 0 ? (
                      <span className="text-slate-500">
                        Resend in{" "}
                        <strong className="text-blue-700 font-bold">
                          0:{String(timer).padStart(2, "0")}
                        </strong>
                      </span>
                    ) : (
                      <button
                        onClick={resendOtp}
                        className="inline-flex items-center gap-1.5 text-blue-700 font-bold hover:underline">
                        <RefreshCw size={12} /> Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    onClick={verifyOtp}
                    disabled={loading || otp.join("").length < 4}
                    className="btn-primary w-full">
                    {loading
                      ? <><Loader2 size={16} className="spinner" /> Verifying…</>
                      : <>Verify &amp; Continue <ArrowRight size={16} /></>}
                  </button>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Demo: <span className="font-mono font-bold text-slate-700">1234</span> to login ·{" "}
                      <span className="font-mono font-bold text-slate-700">0000</span> for unregistered flow
                    </p>
                  </div>
                </div>
              )}

              {/* ── SUCCESS STEP ── */}
              {step === "success" && (
                <div className="py-5 text-center fade-in">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center
                    justify-center mx-auto mb-4">
                    <CheckCircle size={30} className="text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">Login Successful!</h3>
                  <p className="text-slate-500 text-sm mb-5">Welcome, +91 {phone}</p>
                  <p className="text-slate-400 text-xs flex items-center justify-center gap-2">
                    <Loader2 size={13} className="spinner text-blue-500" />
                    Redirecting to video guide…
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            Need help?{" "}
            <a
              href="mailto:creator-support@testbook.com"
              className="text-blue-700 font-semibold hover:underline">
              creator-support@testbook.com
            </a>
          </p>

          <p className="text-center text-xs text-slate-400 mt-2">
            <Link href="/" className="hover:text-slate-600 transition-colors">← Back to Home</Link>
          </p>
        </div>
      </main>

      <div className="h-16 md:hidden" />
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
