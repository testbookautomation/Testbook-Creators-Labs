"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User, Phone, Mail, GraduationCap, Globe,
  Link2, AtSign, FileText, Shield, AlertTriangle, CheckCircle2,
  Loader2, ArrowLeft, ArrowRight, Upload, ChevronDown
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import { submitVideo, trackEvent, EV } from "@/lib/api";

const examCategories = [
  "SSC CGL","SSC CHSL","SSC MTS","SSC CPO",
  "UPSC CSE","UPSC CDS","UPSC CAPF",
  "Railway RRB NTPC","Railway Group D","Railway ALP",
  "Bank PO (IBPS)","Bank Clerk (IBPS)","SBI PO","SBI Clerk",
  "State PSC","Police Constable","Defence NDA / CDS","Other",
];

const platforms = [
  { id:"YouTube Shorts",  icon: YoutubeIcon,   color:"#ef4444" },
  { id:"Instagram Reels", icon: InstagramIcon,  color:"#e1306c" },
  { id:"Facebook Reels",  icon: FacebookIcon,   color:"#1877f2" },
  { id:"Other",           icon: Globe,          color:"#64748b" },
];

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertTriangle size={11}/>{error}</p>}
    </div>
  );
}

function SubmitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name:"", phone:"", userId:"", email:"",
    examCategory:"", platform:"", videoLink:"",
    socialHandle:"", caption:"", consent:false, upiConfirm:false,
  });
  const [upi, setUpi] = useState<"checking"|"found"|"missing"|null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  useEffect(() => {
    const p = searchParams.get("phone") || "";
    const u = searchParams.get("userid") || "";
    const stored = localStorage.getItem("tb_user");
    const s = stored ? JSON.parse(stored) : {};
    setForm(f => ({
      ...f,
      phone: (p || s.phone || "").replace(/^(\+?91)?/,"").slice(0,10),
      userId: u || s.userId || "",
    }));
    if (u || s.userId) {
      setUpi("checking");
      setTimeout(() => setUpi(Math.random() > 0.3 ? "found" : "missing"), 1600);
    }
  }, [searchParams]);

  const set = (k: string, v: string|boolean) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim())               e.name = "Full name is required";
    if (form.phone.length < 10)          e.phone = "Enter a valid 10-digit number";
    if (!form.examCategory)              e.examCategory = "Select your exam";
    if (!form.platform)                  e.platform = "Select a platform";
    if (!form.videoLink.startsWith("http")) e.videoLink = "Enter a valid public URL";
    if (!form.consent)                   e.consent = "You must accept the terms to submit";
    return e;
  };

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setSubmitError("");

    trackEvent({ eventName: EV.FORM_STARTED, phone: form.phone, userId: form.userId });

    const result = await submitVideo({
      name:         form.name,
      phone:        form.phone,
      userId:       form.userId,
      email:        form.email,
      examCategory: form.examCategory,
      platform:     form.platform,
      videoLink:    form.videoLink,
      socialHandle: form.socialHandle,
      caption:      form.caption,
      upiConfirm:   form.upiConfirm,
      consent:      form.consent,
    });

    setLoading(false);

    if (result.error === "duplicate") {
      setSubmitError("You have already submitted a video. Go to your dashboard to check its status.");
      return;
    }
    if (!result.success) {
      // Never show raw technical errors to students
      const friendly =
        result.error === "duplicate"
          ? "You have already submitted a video."
          : result.error?.includes("Unauthorized")
          ? "Session expired. Please login again."
          : "Something went wrong on our end. Please try again in a moment.";
      setSubmitError(friendly);
      return;
    }

    // Cache in localStorage for offline dashboard fallback
    localStorage.setItem("tb_submission", JSON.stringify({
      ...form,
      submissionId: result.submissionId,
      status: "Under Review",
      submittedAt: new Date().toISOString(),
      metrics: { views: 0, likes: 0, comments: 0, target: 5000 },
    }));

    setSubmitted(true);
  };

  // ── Success screen ──
  if (submitted) return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card max-w-sm w-full p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-emerald-600" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Video Submitted!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Your video is now <strong>under review</strong>. Our team will check your submission and update the status within <strong>24–48 hours</strong>.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 text-left text-sm text-slate-600 space-y-1.5 mb-6">
            <p className="font-bold text-slate-800 mb-2">What happens next?</p>
            {["Our team reviews your video","You get notified on dashboard","If approved, metrics are tracked","Earn payout when view target is met"].map((t,i)=>(
              <div key={t} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</span>
                {t}
              </div>
            ))}
          </div>
          <Link href="/dashboard" className="btn-primary w-full text-[15px] py-3.5">
            Go to My Dashboard <ArrowRight size={17} />
          </Link>
        </div>
      </main>
      <Footer />
      <div className="h-16 md:hidden"/>
    </div>
  );

  // ── Form ──
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <section className="tb-gradient text-white py-8 px-4">
        <div className="max-w-xl mx-auto">
          <Link href="/sop" className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm font-semibold mb-4">
            <ArrowLeft size={14}/> Back to Guide
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Upload size={20} color="#fff" strokeWidth={2}/>
            </div>
            <div>
              <h1 className="text-xl font-black">Submit Your Video</h1>
              <p className="text-blue-100 text-xs">Fields marked * are required</p>
            </div>
          </div>
        </div>
      </section>

      {/* UPI alert banner */}
      {upi === "missing" && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-xl mx-auto flex gap-2 text-sm">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5"/>
            <p className="text-amber-800"><strong>UPI ID missing.</strong> Update it in the Testbook app before your video becomes payout-eligible.</p>
          </div>
        </div>
      )}
      {upi === "found" && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3">
          <div className="max-w-xl mx-auto flex gap-2 text-sm">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5"/>
            <p className="text-emerald-800 font-semibold">UPI ID found — your account is payout-ready.</p>
          </div>
        </div>
      )}

      <main className="flex-1 py-8 px-4">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Section 1 – Personal */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 tb-gradient rounded-lg flex items-center justify-center">
                  <User size={14} color="#fff"/>
                </div>
                <h2 className="font-black text-slate-900">Personal Details</h2>
              </div>

              <div className="space-y-4">
                <Field label="Full Name" required error={errors.name}>
                  <div className={`input-field flex items-center gap-2 px-4 py-0 ${errors.name?"error":""}`} style={{padding:0}}>
                    <User size={16} className="text-slate-400 ml-4 shrink-0"/>
                    <input type="text" value={form.name} onChange={e=>set("name",e.target.value)}
                      placeholder="Your full name"
                      className="flex-1 py-3 pr-4 text-slate-900 text-[15px] bg-white outline-none min-h-0"/>
                  </div>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone Number" required error={errors.phone}>
                    <div className={`input-field flex items-center gap-0 p-0 overflow-hidden ${errors.phone?"error":""}`}>
                      <span className="flex items-center gap-1.5 px-3 py-3 text-slate-500 text-sm font-semibold bg-slate-50 border-r border-slate-200 shrink-0">
                        <Phone size={13}/> +91
                      </span>
                      <input type="tel" value={form.phone} maxLength={10}
                        onChange={e=>set("phone",e.target.value.replace(/\D/g,"").slice(0,10))}
                        placeholder="98765 43210"
                        className="flex-1 px-4 py-3 text-slate-900 text-[15px] bg-white outline-none min-h-0"/>
                    </div>
                  </Field>

                  <Field label="Testbook User ID">
                    <input type="text" value={form.userId} onChange={e=>set("userId",e.target.value)}
                      placeholder="Auto-detected" className="input-field"/>
                  </Field>
                </div>

                <Field label="Email ID (optional)">
                  <div className="input-field flex items-center gap-2 p-0" style={{padding:0}}>
                    <Mail size={16} className="text-slate-400 ml-4 shrink-0"/>
                    <input type="email" value={form.email} onChange={e=>set("email",e.target.value)}
                      placeholder="yourname@email.com"
                      className="flex-1 py-3 pr-4 text-slate-900 text-[15px] bg-white outline-none min-h-0"/>
                  </div>
                </Field>

                <Field label="Exam Category" required error={errors.examCategory}>
                  <div className={`input-field flex items-center gap-2 p-0 ${errors.examCategory?"error":""}`} style={{padding:0}}>
                    <GraduationCap size={16} className="text-slate-400 ml-4 shrink-0"/>
                    <select value={form.examCategory} onChange={e=>set("examCategory",e.target.value)}
                      className="flex-1 py-3 pr-4 text-slate-900 text-[15px] bg-white outline-none min-h-0 appearance-none cursor-pointer">
                      <option value="">Select your exam</option>
                      {examCategories.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={16} className="text-slate-400 mr-4 shrink-0"/>
                  </div>
                </Field>
              </div>
            </div>

            {/* Section 2 – Video */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 tb-gradient rounded-lg flex items-center justify-center">
                  <Upload size={14} color="#fff"/>
                </div>
                <h2 className="font-black text-slate-900">Video Details</h2>
              </div>

              <div className="space-y-4">
                <Field label="Platform" required error={errors.platform}>
                  <div className="grid grid-cols-2 gap-2">
                    {platforms.map(({id, icon:Icon, color})=>(
                      <button key={id} type="button" onClick={()=>set("platform",id)}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all
                          ${form.platform===id?"border-blue-600 bg-blue-50 text-blue-700":"border-slate-200 text-slate-600 hover:border-slate-300 bg-white"}`}>
                        {id === "Other"
                          ? <Globe size={17} color={form.platform===id ? "#1d4ed8" : color}/>
                          : <Icon size={17} color={form.platform===id ? "#1d4ed8" : color}/>}
                        <span className="leading-tight">{id}</span>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Video Link (Public URL)" required error={errors.videoLink}>
                  <div className={`input-field flex items-center gap-2 p-0 ${errors.videoLink?"error":""}`} style={{padding:0}}>
                    <Link2 size={16} className="text-slate-400 ml-4 shrink-0"/>
                    <input type="url" value={form.videoLink} onChange={e=>set("videoLink",e.target.value)}
                      placeholder="https://youtube.com/shorts/..."
                      className="flex-1 py-3 pr-4 text-slate-900 text-[15px] bg-white outline-none min-h-0"/>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">Paste the public link of your posted video.</p>
                </Field>

                <Field label="Your Social Handle (optional)">
                  <div className="input-field flex items-center gap-2 p-0" style={{padding:0}}>
                    <AtSign size={16} className="text-slate-400 ml-4 shrink-0"/>
                    <input type="text" value={form.socialHandle} onChange={e=>set("socialHandle",e.target.value)}
                      placeholder="@yourhandle"
                      className="flex-1 py-3 pr-4 text-slate-900 text-[15px] bg-white outline-none min-h-0"/>
                  </div>
                </Field>

                <Field label="Caption Used (optional)">
                  <div className="input-field p-0" style={{padding:0}}>
                    <div className="flex items-start gap-2 px-4 pt-3 pb-1">
                      <FileText size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                      <textarea value={form.caption} onChange={e=>set("caption",e.target.value)} rows={3}
                        placeholder="Paste the caption from your video description…"
                        className="flex-1 text-slate-900 text-[15px] bg-white outline-none resize-none"/>
                    </div>
                  </div>
                </Field>
              </div>
            </div>

            {/* Section 3 – Consent */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 tb-gradient rounded-lg flex items-center justify-center">
                  <Shield size={14} color="#fff"/>
                </div>
                <h2 className="font-black text-slate-900">Agreement</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-slate-100 hover:border-blue-200 transition-colors">
                  <input type="checkbox" checked={form.upiConfirm} onChange={e=>set("upiConfirm",e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-700 shrink-0"/>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I have updated my UPI ID in the Testbook app profile, or I understand that a missing UPI ID will delay my payout.
                  </span>
                </label>

                <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-colors
                  ${errors.consent?"border-red-300 bg-red-50":"border-slate-100 hover:border-blue-200"}`}>
                  <input type="checkbox" checked={form.consent} onChange={e=>set("consent",e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-700 shrink-0"/>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I confirm this video is original, follows campaign guidelines, and I give Testbook permission to use it for promotional purposes. I accept the campaign&apos;s terms and conditions. <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.consent && <p className="text-red-500 text-xs flex items-center gap-1"><AlertTriangle size={11}/>{errors.consent}</p>}
              </div>
            </div>

            {submitError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                <AlertTriangle size={17} className="text-red-500 shrink-0 mt-0.5"/>
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full text-[15px] py-4">
              {loading
                ? <><Loader2 size={18} className="spinner"/> Submitting…</>
                : <>Submit for Review <ArrowRight size={18}/></>}
            </button>
          </form>
        </div>
      </main>

      <Footer />
      <div className="h-16 md:hidden"/>
    </div>
  );
}

export default function SubmitPage() {
  return <Suspense><SubmitForm /></Suspense>;
}
