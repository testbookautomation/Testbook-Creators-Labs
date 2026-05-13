"use client";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Phone, ShieldCheck, ArrowLeft, RefreshCw, AlertTriangle,
  CheckCircle, ExternalLink, Loader2, ArrowRight
} from "lucide-react";
import { trackEvent, EV } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);

  const refs = [
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    const p = searchParams.get("phone") || "";
    const u = searchParams.get("userid") || "";
    if (p) setPhone(p.replace(/^(\+?91)?/, "").slice(0, 10));
    if (u) setUserId(u);
  }, [searchParams]);

  useEffect(() => {
    if (step !== "otp" || timer === 0) return;
    const t = setTimeout(() => setTimer(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const sendOtp = async () => {
    setError("");
    if (phone.length < 10) { setError("Please enter a valid 10-digit phone number."); return; }
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
  };

  const verifyOtp = async () => {
    setError("");
    const code = otp.join("");
    if (code.length < 4) { setError("Enter the complete 4-digit OTP."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (code === "0000") { setStep("phone"); setNotRegistered(true); return; }
    const session = { phone, userId, loggedIn: true };
    localStorage.setItem("tb_user", JSON.stringify(session));
    // Fire OTP verified event (best-effort, non-blocking)
    trackEvent({ eventName: EV.OTP_VERIFIED, phone, userId, page: "/login" });
    setStep("success");
    setTimeout(() => router.push("/sop"), 1400);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">

          {/* Card */}
          <div className="card overflow-hidden">

            {/* Card header */}
            <div className="tb-gradient px-6 py-8 text-white text-center">
              <div className="inline-flex bg-white rounded-xl px-4 py-2 mx-auto mb-4">
                <Image
                  src="/testbook-logo.png"
                  alt="Testbook"
                  width={4500}
                  height={913}
                  className="h-8 w-auto"
                />
              </div>
              <h1 className="text-lg font-black">Testbook Student Creator</h1>
              <p className="text-blue-100 text-sm mt-1">Login to start your creator journey</p>
            </div>

            <div className="px-6 py-6">

              {/* ── PHONE STEP ── */}
              {step === "phone" && (
                <>
                  {notRegistered && (
                    <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                      <div className="flex gap-2 mb-2">
                        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-amber-800 font-bold text-sm">Account not found on Testbook</p>
                      </div>
                      <p className="text-amber-700 text-xs leading-relaxed mb-3">
                        Please create a Testbook account with your phone number first, then come back and login here.
                      </p>
                      <a href="https://testbook.com" target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline">
                        Go to Testbook Signup <ExternalLink size={11} />
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={16} className="text-blue-600" />
                    <h2 className="font-bold text-slate-900">Enter Your Phone Number</h2>
                  </div>
                  <p className="text-slate-500 text-xs mb-5">We&apos;ll send an OTP to verify your Testbook account.</p>

                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <div className={`flex input-field p-0 overflow-hidden mb-1 ${error ? "error" : ""}`}>
                    <span className="flex items-center px-3.5 text-slate-500 text-sm font-semibold bg-slate-50 border-r border-slate-200 shrink-0">+91</span>
                    <input type="tel" value={phone} maxLength={10}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onKeyDown={e => e.key === "Enter" && sendOtp()}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 text-slate-900 text-base bg-white outline-none min-h-0" />
                  </div>
                  {userId && (
                    <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                      <ShieldCheck size={11} className="text-emerald-500" />
                      Testbook ID detected: {userId}
                    </p>
                  )}
                  {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

                  <button onClick={sendOtp} disabled={loading} className="btn-primary w-full mt-1">
                    {loading ? <><Loader2 size={17} className="spinner" /> Sending OTP…</> : <>Send OTP <ArrowRight size={17} /></>}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center mt-5 leading-relaxed">
                    By continuing you agree to Testbook&apos;s campaign terms and privacy policy.
                  </p>
                </>
              )}

              {/* ── OTP STEP ── */}
              {step === "otp" && (
                <>
                  <button onClick={() => { setStep("phone"); setError(""); }}
                    className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold mb-5 hover:text-slate-800">
                    <ArrowLeft size={15} /> Back
                  </button>

                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <h2 className="font-bold text-slate-900">Enter OTP</h2>
                  </div>
                  <p className="text-slate-500 text-xs mb-6">
                    4-digit OTP sent to <strong className="text-slate-800">+91 {phone}</strong>
                  </p>

                  {/* OTP boxes */}
                  <div className="flex gap-3 justify-center mb-5">
                    {otp.map((d, i) => (
                      <input key={i} ref={refs[i]} type="text" inputMode="numeric"
                        value={d} maxLength={1}
                        onChange={e => handleOtpInput(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        className="otp-box" />
                    ))}
                  </div>

                  {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}

                  <div className="text-center text-sm mb-5">
                    {timer > 0
                      ? <span className="text-slate-500">Resend in <strong className="text-blue-700">0:{String(timer).padStart(2,"0")}</strong></span>
                      : <button onClick={async () => { setLoading(true); await new Promise(r=>setTimeout(r,600)); setLoading(false); setTimer(30); setOtp(["","","",""]); }}
                          className="inline-flex items-center gap-1.5 text-blue-700 font-bold hover:underline">
                          <RefreshCw size={13} /> Resend OTP
                        </button>}
                  </div>

                  <button onClick={verifyOtp} disabled={loading || otp.join("").length < 4} className="btn-primary w-full">
                    {loading ? <><Loader2 size={17} className="spinner" /> Verifying…</> : <>Verify &amp; Continue <ArrowRight size={17} /></>}
                  </button>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[11px] text-slate-400">
                      <strong>Demo:</strong> use <span className="font-mono font-bold text-slate-700">1234</span> to login •{" "}
                      <span className="font-mono font-bold text-slate-700">0000</span> to test unregistered flow
                    </p>
                  </div>
                </>
              )}

              {/* ── SUCCESS STEP ── */}
              {step === "success" && (
                <div className="py-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Login Successful!</h3>
                  <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
                    <Loader2 size={14} className="spinner text-blue-600" />
                    Redirecting to video guide…
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            Need help?{" "}
            <Link href="/" className="text-blue-700 font-semibold hover:underline">Contact Support</Link>
          </p>
        </div>
      </main>

      <Footer />
      <div className="h-16 md:hidden" />
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
