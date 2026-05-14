"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User, Users, Phone, Mail, GraduationCap, Globe,
  AtSign, FileText, Shield, AlertTriangle, CheckCircle2,
  Loader2, ArrowLeft, ArrowRight, Upload, ChevronDown, X
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import { submitVideo, trackEvent, fetchUpi, EV } from "@/lib/api";

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
  { id:"Direct Upload",    icon: Upload,        color:"#2563eb" },
  { id:"Other",           icon: Globe,          color:"#64748b" },
];

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

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
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name:"", phone:"", userId:"", email:"",
    examCategory:"", platform:"", followers:"",
    socialHandle:"", caption:"", consent:false, upiConfirm:false,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [upi, setUpi]   = useState<"checking"|"found"|"missing"|null>(null);
  const [vpa, setVpa]   = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState<Record<string,string>>({});

  // On mount — prefill phone/userId from URL or localStorage
  useEffect(() => {
    const p = searchParams.get("phone") || "";
    const u = searchParams.get("userid") || "";
    const stored = localStorage.getItem("tb_user");
    const s = stored ? JSON.parse(stored) : {};
    const phone = (p || s.phone || "").replace(/^(\+?91)?/,"").slice(0,10);
    setForm(f => ({ ...f, phone, userId: u || s.userId || "" }));
  }, [searchParams]);

  // Whenever phone hits 10 digits, look up real UPI from Testbook
  useEffect(() => {
    if (form.phone.length !== 10) { setUpi(null); setVpa(null); return; }
    let cancelled = false;
    setUpi("checking");
    setVpa(null);
    fetchUpi(form.phone).then(({ vpa: v, found }) => {
      if (cancelled) return;
      setVpa(v);
      setUpi(found && v ? "found" : "missing");
    });
    return () => { cancelled = true; };
  }, [form.phone]);

  const set = (k: string, v: string|boolean) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim())               e.name = "Full name is required";
    if (form.phone.length < 10)          e.phone = "Enter a valid 10-digit number";
    if (!form.examCategory)              e.examCategory = "Select your exam";
    if (!form.platform)                  e.platform = "Select a platform";
    if (form.platform && !form.followers)  e.followers = "Enter your follower/subscriber count";
    if (!videoFile) {
      e.videoFile = "Upload your video file";
    } else if (!videoFile.type.startsWith("video/")) {
      e.videoFile = "Upload a valid video file";
    } else if (videoFile.size > MAX_VIDEO_BYTES) {
      e.videoFile = "Video must be 50 MB or smaller";
    }
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
      followers:    form.followers,
      videoLink:    "",
      videoFile:    videoFile,
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
      videoLink: result.videoLink || "",
      cdnUrl: result.cdnUrl || "",
      videoFileName: videoFile?.name || "",
      followers: form.followers,
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
            Your video is now <strong>under review</strong>. Our team will check your submission and update the status on your dashboard.
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

      {/* UPI banner */}
      {upi === "checking" && (
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <div className="max-w-xl mx-auto flex gap-2 text-sm items-center">
            <Loader2 size={15} className="text-slate-400 spinner shrink-0"/>
            <p className="text-slate-500">Checking UPI status…</p>
          </div>
        </div>
      )}
      {upi === "missing" && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-xl mx-auto flex gap-2 text-sm">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5"/>
            <p className="text-amber-800"><strong>UPI ID not found.</strong> Update it in the Testbook app before your video becomes payout-eligible.</p>
          </div>
        </div>
      )}
      {upi === "found" && vpa && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3">
          <div className="max-w-xl mx-auto flex gap-2 text-sm">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5"/>
            <p className="text-emerald-800 font-semibold">UPI ready: <span className="font-black">{vpa}</span></p>
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
                <input type="hidden" value={form.userId} readOnly />

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
                <Field label="How many followers / subscribers do you have?" required error={errors.followers}>
                  <div className={`input-field flex items-center gap-2 p-0 ${errors.followers?"error":""}`} style={{padding:0}}>
                    <Users size={16} className="text-slate-400 ml-4 shrink-0"/>
                    <input
                      type="number"
                      min="0"
                      value={form.followers}
                      onChange={e=>set("followers", e.target.value)}
                      placeholder="e.g. 5000"
                      className="flex-1 py-3 pr-4 text-slate-900 text-[15px] bg-white outline-none min-h-0"/>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">Enter the approximate count from your social profile.</p>
                </Field>

                <Field label="Platform" required error={errors.platform}>
                  <div className={`input-field flex items-center gap-2 p-0 ${errors.platform?"error":""}`} style={{padding:0}}>
                    <Globe size={16} className="text-slate-400 ml-4 shrink-0"/>
                    <select
                      value={form.platform}
                      onChange={e=>set("platform", e.target.value)}
                      className="flex-1 py-3 pr-4 text-slate-900 text-[15px] bg-white outline-none min-h-0 appearance-none cursor-pointer">
                      <option value="">Select your platform</option>
                      {platforms.map(({id})=>(
                        <option key={id} value={id}>{id}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="text-slate-400 mr-4 shrink-0"/>
                  </div>
                </Field>

                <Field label="Video Upload" required error={errors.videoFile}>
                  <label className={`flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-5 text-center transition-colors ${
                    errors.videoFile ? "border-red-300 bg-red-50" : "border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-blue-50"
                  }`}>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/*"
                      className="sr-only"
                      onChange={e => {
                        const file = e.target.files?.[0] ?? null;
                        setVideoFile(file);
                        setErrors(prev => ({ ...prev, videoFile:"" }));
                      }}
                    />
                    <Upload size={24} className="mb-2 text-blue-600"/>
                    <span className="text-sm font-black text-slate-900">Choose video file</span>
                    <span className="mt-1 text-xs text-slate-500">MP4, MOV, or WEBM up to 50 MB</span>
                  </label>
                  {videoFile && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm">
                      <Upload size={14} className="text-blue-600 shrink-0"/>
                      <span className="min-w-0 flex-1 truncate font-semibold text-blue-900">{videoFile.name}</span>
                      <span className="text-xs text-blue-600">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                      <button type="button" aria-label="Remove video file" onClick={() => setVideoFile(null)} className="rounded-md p-1 text-blue-700 hover:bg-blue-100">
                        <X size={14}/>
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1.5">Uploaded files are saved to the LMS CDN for review.</p>
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
                    I confirm this video is original, follows campaign guidelines, and I give Testbook permission to use it for promotional purposes. I have read and accept the{" "}
                    <Link href="/terms" target="_blank" className="text-blue-700 font-bold hover:underline">Terms &amp; Conditions</Link>.{" "}
                    <span className="text-red-500">*</span>
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
