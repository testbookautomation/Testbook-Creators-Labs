import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MessageSquare, Zap, Heart, Megaphone, Upload,
  Clock, Smartphone, Mic, Eye, CheckCircle, XCircle,
  AlertTriangle, Copy, ArrowRight, BookOpen
} from "lucide-react";
import DemoVideo from "@/components/DemoVideo";

const steps = [
  { icon: MessageSquare, color: "#3b82f6", title: "Start with Your Struggle",     desc: "Open your video by talking about a real problem you faced — expensive coaching, lack of material, or time management during exam prep." },
  { icon: Zap,           color: "#f97316", title: "Introduce Testbook Pass",       desc: "Explain how Testbook Pass solved your problem. Name specific features you use — mock tests, PYQs, live classes, or study notes." },
  { icon: Heart,         color: "#e11d48", title: "Share Your Experience",         desc: "Speak naturally and authentically. Share a personal moment or result. Viewers trust real stories, not scripted ads." },
  { icon: Megaphone,     color: "#8b5cf6", title: "Give a Strong Message",         desc: "End with an encouraging call-to-action for other aspirants. Tell them why they should try Testbook Pass today." },
  { icon: Upload,        color: "#0891b2", title: "Upload on Creators Lab",        desc: "Upload it on Creators Lab by tapping + Submit Video on the homepage. No need to post it on YouTube or Instagram. Just upload directly on the portal and we'll handle the rest." },
  { icon: CheckCircle,   color: "#16a34a", title: "Wait for Approval",             desc: "Our team reviews every video within 48 hours. You'll get notified once it's approved or if anything needs fixing." },
];

const specs = [
  { icon: Clock,    label: "Duration",   value: "30–90 sec" },
  { icon: Smartphone,label: "Format",    value: "9:16 Vertical" },
  { icon: Mic,      label: "Audio",      value: "Clear voice" },
  { icon: Eye,      label: "Visibility", value: "Must be Public" },
];

const dos = [
  "Video is 30–90 seconds long",
  "Speak clearly in Hindi, English, or your language",
  "Mention Testbook Pass by name",
  "Use vertical format (9:16 — like Reels)",
  "Caption includes the required hashtags",
  "Upload directly on the Creators Lab portal",
  "Show genuine preparation experience",
];

const donts = [
  "Do not copy anyone else's video",
  "Do not make false claims about exam results",
  "Do not include offensive or inappropriate content",
  "Do not delete the video after submitting",
  "Do not submit the same video multiple times",
  "Do not promote any other brand in the video",
  "Do not use background music with copyright issues",
];

const rejectionReasons = [
  "Testbook Pass not mentioned in the video",
  "Audio is unclear or inaudible",
  "Video shorter than 30 seconds",
  "Copied content from another creator",
  "Contains misleading or false claims",
  "Required hashtags missing from caption",
  "Inappropriate or offensive content",
];

const caption = `Maine Testbook Pass se apni preparation ki aur ye mera experience hai 🎯

Agar aap bhi government exam de rahe hain, to Testbook Pass ek baar zaroor try karein.

Mock Tests | PYQs | Live Classes | Study Notes — sab kuch ek jagah ✅

#TestbookPass #GovernmentExam #StudentCreator #UGC #TestbookCreator #PrepWithTestbook`;

export default function SopPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="tb-gradient text-white py-14 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="text-center lg:text-left lg:col-span-6">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4">
              <BookOpen size={26} color="#fff" strokeWidth={2} />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black leading-tight mb-4">
              How to Create Your Video
            </h1>
            <p className="text-blue-100 text-sm sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Follow this step-by-step guide to make a high-quality video that gets approved fast and earns you a payout.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="glass rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto lg:ml-auto">
              <p className="text-xs font-black text-blue-100 uppercase tracking-widest mb-4">
                Approval checklist
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white/10 border border-white/10 rounded-xl p-4">
                    <Icon size={18} className="text-orange-200 mb-3" />
                    <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-base font-black text-white mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-6 text-center">Step-by-Step Guide</h2>
          <div className="grid lg:grid-cols-2 gap-4">
            {steps.map(({ icon: Icon, color, title, desc }, i) => (
              <div key={title} className="card p-5 flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon size={20} color={color} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-slate-300">0{i + 1}</span>
                    <h3 className="font-bold text-slate-900 text-[15px]">{title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Video ── */}
      <DemoVideo />

      {/* ── Specs ── */}
      <section className="py-10 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-black text-slate-900 mb-5 text-center">Video Requirements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="card p-4 text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-blue-600" strokeWidth={2} />
                </div>
                <div className="text-[11px] text-slate-400 mb-1">{label}</div>
                <div className="text-sm font-black text-slate-900">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Do's & Don'ts ── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-6 text-center">Do&apos;s and Don&apos;ts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={18} className="text-emerald-600" strokeWidth={2} />
                <h3 className="font-black text-emerald-800">Do&apos;s</h3>
              </div>
              <ul className="space-y-2.5">
                {dos.map(d => (
                  <li key={d} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 bg-emerald-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[9px] font-black text-emerald-700">✓</span>
                    </span>
                    <span className="text-sm text-emerald-900">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={18} className="text-red-600" strokeWidth={2} />
                <h3 className="font-black text-red-800">Don&apos;ts</h3>
              </div>
              <ul className="space-y-2.5">
                {donts.map(d => (
                  <li key={d} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 bg-red-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[9px] font-black text-red-700">✕</span>
                    </span>
                    <span className="text-sm text-red-900">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rejection reasons ── */}
      <section className="py-10 px-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className="text-amber-600" strokeWidth={2} />
            <h2 className="text-lg font-black text-slate-900">Common Rejection Reasons</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {rejectionReasons.map(r => (
              <div key={r} className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-4 py-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-sm text-slate-700">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Caption ── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <Copy size={18} className="text-blue-600" strokeWidth={2} />
            <h2 className="text-lg font-black text-slate-900">Sample Caption &amp; Hashtags</h2>
          </div>
          <div className="card overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Copy this caption</span>
              <span className="text-xs text-slate-400">YouTube Shorts / Instagram Reels</span>
            </div>
            <pre className="px-5 py-5 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">{caption}</pre>
          </div>
          <p className="text-xs text-slate-400 mt-3">Use this caption as a reference while creating your video.</p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="tb-gradient py-12 px-4 text-white text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-black mb-3">Ready to Submit?</h2>
          <p className="text-blue-100 text-sm mb-6">Upload your video directly on Creators Lab for review.</p>
          <div className="flex flex-col gap-3">
            <Link href="/submit" className="btn-orange text-[15px] py-3.5">
              Submit Your Video <ArrowRight size={17} />
            </Link>
            <Link href="/login" className="btn-ghost text-[15px] py-3.5" style={{ borderColor:"rgba(255,255,255,.3)", color:"#fff" }}>
              Login First
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <div className="h-16 md:hidden" />
    </div>
  );
}
