import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";
import { SopCTA } from "@/components/CampaignCTA";
import DemoVideo from "@/components/DemoVideo";
import {
  MessageSquare, Zap, Heart, Megaphone, Hash, Upload,
  Clock, Maximize2, Mic, Eye, CheckCircle, XCircle,
  AlertTriangle, BookOpen, ChevronRight,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon } from "@/components/BrandIcons";

const steps = [
  {
    icon: MessageSquare, color: "#2563eb", bg: "#eff6ff", num: "01",
    title: "Start with Your Struggle",
    desc: "Open your video by talking about a real problem you faced — expensive coaching, lack of material, or time management during exam prep.",
  },
  {
    icon: Zap, color: "#ea580c", bg: "#fff7ed", num: "02",
    title: "Introduce Testbook Pass",
    desc: "Explain how Testbook Pass solved your problem. Name specific features — mock tests, PYQs, live classes, or study notes.",
  },
  {
    icon: Heart, color: "#e11d48", bg: "#fff1f2", num: "03",
    title: "Share Your Experience",
    desc: "Speak naturally and authentically. Share a personal moment or result. Viewers trust real stories, not scripted ads.",
  },
  {
    icon: Megaphone, color: "#7c3aed", bg: "#f5f3ff", num: "04",
    title: "Give a Strong CTA",
    desc: "End with an encouraging call-to-action for other aspirants. Tell them why they should try Testbook Pass today.",
  },
  {
    icon: Hash, color: "#0891b2", bg: "#ecfeff", num: "05",
    title: "Add Caption & Hashtags",
    desc: "Copy the exact caption and hashtags shown below. Paste them in your video description before posting.",
  },
  {
    icon: Upload, color: "#16a34a", bg: "#f0fdf4", num: "06",
    title: "Post Publicly & Submit",
    desc: "Upload your video publicly. Copy the link and submit it on our platform. Done!",
  },
];

const specs = [
  { icon: Clock,     label: "Duration",    value: "30–90 sec",    color: "#2563eb", bg: "#eff6ff" },
  { icon: Maximize2, label: "Format",      value: "9:16 Vertical",color: "#7c3aed", bg: "#f5f3ff" },
  { icon: Mic,       label: "Audio",       value: "Clear voice",  color: "#e11d48", bg: "#fff1f2" },
  { icon: Eye,       label: "Visibility",  value: "Must be Public",color: "#16a34a", bg: "#f0fdf4" },
];

const dos = [
  "Video is 30–90 seconds long",
  "Speak clearly in Hindi, English, or your language",
  "Mention Testbook Pass by name",
  "Video is posted publicly on your channel",
  "Use vertical format (9:16 — like Reels)",
  "Caption includes the required hashtags",
  "Submit the link only after posting publicly",
  "Show genuine preparation experience",
];

const donts = [
  "Do not copy anyone else's video",
  "Do not make false claims about exam results",
  "Do not include offensive or inappropriate content",
  "Do not keep the video private or restricted",
  "Do not delete the video after submitting",
  "Do not submit the same video multiple times",
  "Do not promote any other brand in the video",
  "Do not use background music with copyright issues",
];

const rejectionReasons = [
  "Video link is private or inaccessible",
  "Testbook Pass not mentioned in the video",
  "Audio is unclear or inaudible",
  "Video shorter than 30 seconds",
  "Copied content from another creator",
  "Contains misleading or false claims",
  "Required hashtags missing from caption",
  "Inappropriate or offensive content",
];

const platforms = [
  { icon: YoutubeIcon,   name: "YouTube Shorts",  tag: "Recommended", color: "#ef4444" },
  { icon: InstagramIcon, name: "Instagram Reels",  tag: "Popular",     color: "#e1306c" },
  { icon: FacebookIcon,  name: "Facebook Reels",   tag: "Accepted",    color: "#1877f2" },
];

const caption = `Maine Testbook Pass se apni preparation ki aur ye mera experience hai 🎯

Agar aap bhi government exam de rahe hain, to Testbook Pass ek baar zaroor try karein.

Mock Tests | PYQs | Live Classes | Study Notes — sab kuch ek jagah ✅

#TestbookPass #GovernmentExam #StudentCreator #UGC #TestbookCreator #PrepWithTestbook`;

export default function SopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="tb-gradient text-white pt-12 pb-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex w-16 h-16 bg-white/12 rounded-2xl items-center
            justify-center mx-auto mb-5 ring-1 ring-white/20">
            <BookOpen size={28} color="#fff" strokeWidth={2} />
          </div>
          <span className="inline-flex items-center text-[11px] font-bold text-blue-200
            bg-white/10 rounded-full px-3.5 py-1.5 mb-5 uppercase tracking-widest">
            Step-by-Step Guide
          </span>
          <h1 className="text-3xl sm:text-[42px] font-black tracking-tight leading-tight mb-4">
            How to Create<br />Your Video
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
            Follow this guide to make a high-quality video that gets approved fast and earns you a payout.
          </p>

          {/* Quick spec pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass flex items-center gap-2 rounded-full px-4 py-2">
                <Icon size={13} className="text-blue-200 shrink-0" />
                <span className="text-xs font-semibold text-white">
                  {label}: <span className="font-black">{value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6-Step Guide ──────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-tag text-blue-700 bg-blue-50">Content structure</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              6-Step Video Formula
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
              Each step builds on the last. Follow this order for maximum approval rate.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[28px] top-12 bottom-12 w-px
              bg-gradient-to-b from-blue-200 via-slate-200 to-emerald-200
              hidden sm:block" />

            <div className="space-y-3">
              {steps.map(({ icon: Icon, color, bg, num, title, desc }) => (
                <div key={num}
                  className="card p-5 flex gap-5 relative group
                    hover:shadow-md transition-all duration-200 hover:-translate-y-px">
                  {/* Icon circle */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-14 h-14 rounded-2xl flex flex-col items-center
                      justify-center shrink-0 ring-4 ring-white z-10 relative"
                      style={{ background: bg }}>
                      <Icon size={20} color={color} strokeWidth={2} />
                      <span className="text-[9px] font-black mt-0.5"
                        style={{ color }}>
                        {num}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-black text-slate-900 text-[15px] mb-1.5">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>

                  {/* Step number watermark */}
                  <span className="absolute right-4 top-4 text-4xl font-black text-slate-100
                    select-none group-hover:text-slate-200 transition-colors">
                    {num}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Demo Video ────────────────────────────────── */}
      <DemoVideo />

      {/* ── Video Requirements ────────────────────────── */}
      <section className="py-12 px-4 bg-[#f8fafc]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-6 text-center">
            Video Requirements
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {specs.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="card p-5 text-center group
                hover:shadow-md transition-all duration-200 hover:-translate-y-px">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center
                  mx-auto mb-3 transition-transform group-hover:scale-110"
                  style={{ background: bg }}>
                  <Icon size={19} color={color} strokeWidth={2} />
                </div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase
                  tracking-widest mb-0.5">
                  {label}
                </div>
                <div className="text-sm font-black text-slate-900">{value}</div>
              </div>
            ))}
          </div>

          {/* Platforms */}
          <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-widest text-center">
            Supported Platforms
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {platforms.map(({ icon: Icon, name, tag, color }) => (
              <div key={name}
                className="card p-4 flex flex-col items-center gap-2.5 text-center
                  hover:shadow-md transition-all duration-200 hover:-translate-y-px">
                <Icon size={28} color={color} />
                <div>
                  <p className="text-xs font-black text-slate-800 leading-tight">{name}</p>
                  <p className="text-[10px] font-semibold mt-0.5"
                    style={{ color }}>{tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Do's & Don'ts ─────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="section-tag text-slate-600 bg-slate-100">Guidelines</span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Do&apos;s and Don&apos;ts</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Do's */}
            <div className="rounded-2xl overflow-hidden border border-emerald-200
              shadow-sm shadow-emerald-50">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600
                px-5 py-3.5 flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle size={15} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-white text-[15px]">Do&apos;s</h3>
                <span className="ml-auto text-xs text-emerald-200 font-semibold">
                  {dos.length} rules
                </span>
              </div>
              <div className="bg-emerald-50 p-5 space-y-3">
                {dos.map((d, i) => (
                  <div key={d} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-emerald-100 border border-emerald-200
                      rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-black text-emerald-700">
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-sm text-emerald-900 leading-relaxed">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Don'ts */}
            <div className="rounded-2xl overflow-hidden border border-red-200
              shadow-sm shadow-red-50">
              <div className="bg-gradient-to-r from-red-600 to-rose-600
                px-5 py-3.5 flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <XCircle size={15} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-white text-[15px]">Don&apos;ts</h3>
                <span className="ml-auto text-xs text-red-200 font-semibold">
                  {donts.length} rules
                </span>
              </div>
              <div className="bg-red-50 p-5 space-y-3">
                {donts.map((d, i) => (
                  <div key={d} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-100 border border-red-200
                      rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-black text-red-600">
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-sm text-red-900 leading-relaxed">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rejection Reasons ─────────────────────────── */}
      <section className="py-10 px-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-amber-100 border border-amber-200 rounded-xl
              flex items-center justify-center shrink-0">
              <AlertTriangle size={17} className="text-amber-600" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Common Rejection Reasons</h2>
              <p className="text-xs text-slate-500">Avoid these to get approved on first review</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            {rejectionReasons.map((r, i) => (
              <div key={r}
                className="flex items-center gap-3 bg-white border border-amber-100
                  rounded-xl px-4 py-3">
                <span className="text-[10px] font-black text-amber-400 shrink-0
                  w-5 text-center">
                  #{i + 1}
                </span>
                <div className="w-px h-4 bg-amber-100 shrink-0" />
                <span className="text-sm text-slate-700 leading-relaxed">{r}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <Link href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-bold
                text-amber-700 hover:text-amber-900 transition-colors">
              Check your submission status <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sample Caption ────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-7">
            <span className="section-tag text-blue-700 bg-blue-50">Ready to use</span>
            <h2 className="text-xl font-black text-slate-900 mt-3">
              Sample Caption &amp; Hashtags
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Copy and paste this exactly into your video description before posting.
            </p>
          </div>

          {/* Code-block style card */}
          <div className="card overflow-hidden ring-highlight">
            {/* Top bar — macOS style */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-[11px] text-slate-500 font-mono ml-1">
                  caption.txt
                </span>
              </div>
              <CopyButton text={caption} />
            </div>
            {/* Caption content */}
            <div className="bg-slate-950 px-6 py-6">
              <pre className="text-sm text-slate-200 whitespace-pre-wrap leading-[1.8]
                font-mono tracking-wide">
                {caption}
              </pre>
            </div>
            {/* Footer */}
            <div className="px-5 py-3 bg-slate-900/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 font-mono">
                UTF-8 · {caption.length} characters
              </span>
              <span className="text-[10px] text-slate-600 font-mono">
                YouTube Shorts / Instagram Reels / Facebook Reels
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────── */}
      <section className="tb-gradient py-16 px-4 text-white text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-14 h-14 bg-white/12 rounded-2xl flex items-center
            justify-center mx-auto mb-5 ring-1 ring-white/20">
            <Upload size={24} color="#fff" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-black mb-3">Ready to Submit?</h2>
          <p className="text-blue-100 text-sm mb-8 leading-relaxed">
            Post your video publicly, copy the link, and submit it for review.
          </p>
          <SopCTA />
        </div>
      </section>

      <Footer />
      <div className="h-16 md:hidden" />
    </div>
  );
}
