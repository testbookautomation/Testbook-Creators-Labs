"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CheckCircle2, Clock, XCircle, Eye, ThumbsUp, MessageCircle,
  IndianRupee, ShieldCheck, AlertTriangle, ArrowRight, LayoutDashboard,
  Video, BookOpen, Upload, Headphones, ChevronRight, Loader2,
  Globe, TrendingUp, RefreshCw
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import { fetchStatus, trackEvent, EV } from "@/lib/api";

type Status =
  | "Submitted" | "Under Review" | "Approved" | "Rejected"
  | "Metrics Pending" | "Eligible for Payout" | "Payout Processing"
  | "Payout Completed" | "Payout Failed";

interface StatusCfg {
  badge: string;
  icon: React.ElementType;
  iconColor: string;
  bg: string;
  border: string;
  title: string;
  desc: string;
  next: string;
}

const STATUS: Record<Status, StatusCfg> = {
  "Submitted":           { badge:"badge-blue",   icon:Upload,       iconColor:"#2563eb", bg:"bg-blue-50",   border:"border-blue-200",   title:"Video Submitted",          desc:"Your video has been received. Our team will start the review soon.", next:"Sit tight — review usually takes 24–48 hours." },
  "Under Review":        { badge:"badge-yellow",  icon:Clock,        iconColor:"#b45309", bg:"bg-amber-50",  border:"border-amber-200",  title:"Under Review",             desc:"Our team is actively reviewing your video for quality and guideline compliance.", next:"You will be notified once the review is complete." },
  "Approved":            { badge:"badge-green",   icon:CheckCircle2, iconColor:"#16a34a", bg:"bg-emerald-50",border:"border-emerald-200",title:"Video Approved!",          desc:"Great news! Your video passed review. We are now tracking its performance.", next:"Keep promoting your video to hit the view target." },
  "Rejected":            { badge:"badge-red",     icon:XCircle,      iconColor:"#dc2626", bg:"bg-red-50",    border:"border-red-200",    title:"Video Rejected",           desc:"Your video was not approved this time. Check the reason below.", next:"Fix the issue and submit a new video." },
  "Metrics Pending":     { badge:"badge-purple",  icon:TrendingUp,   iconColor:"#7c3aed", bg:"bg-purple-50", border:"border-purple-200", title:"Tracking Views",           desc:"Your video is approved and we are monitoring its performance. Keep sharing it!", next:"Share on more platforms to reach the view target faster." },
  "Eligible for Payout": { badge:"badge-green",   icon:IndianRupee,  iconColor:"#16a34a", bg:"bg-emerald-50",border:"border-emerald-200",title:"Eligible for Payout!",     desc:"🎉 Your video crossed the view target. Payout is being processed now.", next:"Your UPI payout will be credited within 24–48 working hours." },
  "Payout Processing":   { badge:"badge-indigo",  icon:Loader2,      iconColor:"#4338ca", bg:"bg-indigo-50", border:"border-indigo-200", title:"Payout Processing",        desc:"Your payout is being processed via Razorpay. Almost there!", next:"Check your UPI account. If not received in 48 hours, contact support." },
  "Payout Completed":    { badge:"badge-green",   icon:ShieldCheck,  iconColor:"#16a34a", bg:"bg-emerald-50",border:"border-emerald-200",title:"Payout Completed!",        desc:"Money has been successfully credited to your UPI ID. Congratulations!", next:"Thank you for participating! Look out for the next campaign." },
  "Payout Failed":       { badge:"badge-red",     icon:AlertTriangle,iconColor:"#dc2626", bg:"bg-red-50",    border:"border-red-200",    title:"Payout Failed",            desc:"Payout could not be processed — likely due to an invalid UPI ID.", next:"Update your UPI in Testbook app and contact our support team." },
};

const TIMELINE: Status[] = ["Submitted","Under Review","Approved","Metrics Pending","Eligible for Payout","Payout Processing","Payout Completed"];
const ALL_STATUSES: Status[] = [...TIMELINE, "Rejected", "Payout Failed"];

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  "YouTube Shorts":  YoutubeIcon,
  "Instagram Reels": InstagramIcon,
  "Facebook Reels":  FacebookIcon,
};


const DEMO = {
  submissionId:"TB-DEMO25",
  name:"Rahul Verma", phone:"9876543210", userId:"66abc855oil",
  examCategory:"SSC CGL", platform:"YouTube Shorts",
  videoLink:"https://youtube.com/shorts/example",
  socialHandle:"@rahulverma",
  status:"Under Review" as Status,
  submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  rejectionReason:"",
  metrics:{views:0, likes:0, comments:0, target:5000},
};

export default function DashboardPage() {
  const [sub, setSub] = useState(DEMO);
  const [status, setStatus] = useState<Status>("Under Review");
  const [isDemo, setIsDemo] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const load = async () => {
      // 1. Load from localStorage (instant, offline-safe)
      const raw = localStorage.getItem("tb_submission");
      const user = localStorage.getItem("tb_user");
      const local = raw ? JSON.parse(raw) : null;

      if (local) {
        setSub({ ...DEMO, ...local });
        setStatus(local.status || "Under Review");
        setIsDemo(false);
      }

      // 2. Fetch live status from Google Sheet via API
      const phone  = local?.phone  || (user ? JSON.parse(user).phone  : "");
      const userId = local?.userId || (user ? JSON.parse(user).userId : "");
      if (!phone && !userId) return;

      setFetching(true);
      const live = await fetchStatus(phone, userId);
      setFetching(false);

      if (live) {
        const merged = { ...DEMO, ...local, ...live };
        setSub(merged);
        setStatus(live.status as Status || "Under Review");
        setIsDemo(false);
        // Update localStorage cache with latest status
        localStorage.setItem("tb_submission", JSON.stringify({ ...local, status: live.status }));
        // Track dashboard view
        trackEvent({ eventName: EV.DASHBOARD_VIEWED, phone, userId, page: "/dashboard" });
      }
    };
    load();
  }, []);

  const cfg = STATUS[status];
  const Icon = cfg.icon;
  const isRejected = status === "Rejected";
  const curIdx = TIMELINE.indexOf(status);

  const demoViews =
    status === "Metrics Pending"                                        ? 2840
    : status === "Eligible for Payout" || status === "Payout Processing"
      || status === "Payout Completed"                                  ? 6400 : 0;

  const pct = Math.min(Math.round((demoViews / sub.metrics.target) * 100), 100);
  const PlatIcon = PLATFORM_ICONS[sub.platform] || Globe;

  const cycle = (dir: 1|-1) => {
    const i = ALL_STATUSES.indexOf(status);
    setStatus(ALL_STATUSES[(i + dir + ALL_STATUSES.length) % ALL_STATUSES.length]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* ── Header ── */}
      <section className="tb-gradient text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <LayoutDashboard size={20} color="#fff" strokeWidth={2}/>
            </div>
            <div>
              <h1 className="text-lg font-black">My Dashboard</h1>
              <p className="text-blue-100 text-xs">Track your video, metrics &amp; payout</p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Live fetch indicator */}
          {fetching && !isDemo && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
              <Loader2 size={14} className="spinner shrink-0"/>
              Syncing latest status from Google Sheet…
            </div>
          )}

          {/* Demo banner */}
          {isDemo && (
            <div className="card p-4 border-l-4 border-l-amber-400">
              <p className="text-sm font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                <AlertTriangle size={14}/> Demo Mode
              </p>
              <p className="text-xs text-amber-700 mb-3">
                Showing sample data. <Link href="/submit" className="underline font-semibold">Submit a video</Link> to see your real dashboard.
              </p>
              <div className="flex items-center gap-2">
                <button onClick={()=>cycle(-1)} className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                  <ChevronRight size={12} className="rotate-180"/> Prev
                </button>
                <span className="text-xs font-black text-slate-800 flex-1 text-center">{status}</span>
                <button onClick={()=>cycle(1)} className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                  Next <ChevronRight size={12}/>
                </button>
              </div>
            </div>
          )}

          {/* ── Status card ── */}
          <div className="card p-5">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Submission ID</p>
                <p className="font-black text-slate-900 font-mono text-sm">{sub.submissionId}</p>
              </div>
              <span className={`badge ${cfg.badge} shrink-0`}>
                <Icon size={13} strokeWidth={2}/> {status}
              </span>
            </div>

            {/* Timeline */}
            <div className="overflow-x-auto -mx-1 px-1 pb-1">
              <div className="flex items-start min-w-max gap-0">
                {TIMELINE.map((s, i) => {
                  const done  = !isRejected && curIdx > i;
                  const active= !isRejected && status === s;
                  return (
                    <div key={s} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all text-[10px] font-black
                          ${done   ? "bg-emerald-500 border-emerald-500 text-white"
                          : active ? "bg-blue-600 border-blue-600 text-white"
                          : isRejected ? "border-slate-200 bg-white text-slate-300"
                          : "border-slate-200 bg-white text-slate-400"}`}>
                          {done ? <CheckCircle2 size={13} strokeWidth={3}/> : i + 1}
                        </div>
                        <span className={`text-[9px] mt-1 font-bold whitespace-nowrap max-w-[56px] text-center leading-tight
                          ${active ? "text-blue-700" : done ? "text-emerald-600" : "text-slate-400"}`}>
                          {s.split(" ").slice(0,2).join(" ")}
                        </span>
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div className={`w-8 h-0.5 mx-0.5 mb-4 shrink-0 ${!isRejected && curIdx > i ? "bg-emerald-400" : "bg-slate-200"}`}/>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status detail */}
            <div className={`mt-4 p-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
              <div className="flex items-start gap-3">
                <Icon size={18} color={cfg.iconColor} strokeWidth={2} className="shrink-0 mt-0.5"/>
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{cfg.title}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{cfg.desc}</p>
                  <p className="text-slate-500 text-xs mt-2 flex items-center gap-1.5">
                    <ArrowRight size={11}/> {cfg.next}
                  </p>
                </div>
              </div>
            </div>

            {/* Rejection */}
            {status === "Rejected" && (
              <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-sm font-bold text-red-800 mb-1.5 flex items-center gap-2"><XCircle size={14}/> Rejection Reason</p>
                <p className="text-red-700 text-sm">{sub.rejectionReason || "Your video link appears to be private or inaccessible. Please make the video public and resubmit."}</p>
                <Link href="/submit" className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-blue-700 hover:underline">
                  Submit New Video <ArrowRight size={13}/>
                </Link>
              </div>
            )}
          </div>

          {/* ── Submission details ── */}
          <div className="card p-5">
            <h2 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <Video size={16} className="text-blue-600"/> Submission Details
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { l:"Name",          v: sub.name },
                { l:"Phone",         v: "+91 " + sub.phone },
                { l:"Exam Category", v: sub.examCategory },
                { l:"Submitted",     v: new Date(sub.submittedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) },
              ].map(({ l, v }) => (
                <div key={l} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{l}</p>
                  <p className="text-sm font-bold text-slate-900">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 mb-3">
              {sub.platform in PLATFORM_ICONS
                ? <PlatIcon size={18} />
                : <Globe size={18} className="text-slate-500 shrink-0"/>}
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Platform</p>
                <p className="text-sm font-bold text-slate-900">{sub.platform}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Video Link</p>
              <a href={sub.videoLink} target="_blank" rel="noreferrer"
                className="text-blue-700 text-sm font-semibold hover:underline break-all">{sub.videoLink}</a>
            </div>
          </div>

          {/* ── Metrics ── */}
          {(status === "Approved" || status === "Metrics Pending" || status === "Eligible for Payout" || status === "Payout Processing" || status === "Payout Completed") && (
            <div className="card p-5">
              <h2 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-600"/> Video Performance
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon:Eye,           label:"Views",    value: demoViews.toLocaleString("en-IN"), color:"text-blue-600" },
                  { icon:ThumbsUp,      label:"Likes",    value: pct>=100?"398":"142", color:"text-rose-500" },
                  { icon:MessageCircle, label:"Comments", value: pct>=100?"47":"18",   color:"text-emerald-600" },
                ].map(({ icon:Ic, label, value, color }) => (
                  <div key={label} className="bg-slate-50 rounded-2xl p-4 text-center">
                    <Ic size={20} className={`${color} mx-auto mb-2`} strokeWidth={2}/>
                    <div className="text-lg font-black text-slate-900">{value}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{label}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">View Target Progress</span>
                  <span className="text-sm font-black text-blue-700">{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className={`h-3 rounded-full progress-fill ${pct>=100?"bg-emerald-500":"tb-gradient"}`}
                    style={{ width:`${pct}%` }}/>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>{demoViews.toLocaleString("en-IN")} views</span>
                  <span>Target: {sub.metrics.target.toLocaleString("en-IN")}</span>
                </div>
                {pct < 100 && (
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <RefreshCw size={11}/> Keep sharing your video to reach the {sub.metrics.target.toLocaleString("en-IN")} view target.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Payout ── */}
          <div className="card p-5">
            <h2 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <IndianRupee size={16} className="text-emerald-600"/> Payout Status
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Eligibility</p>
                  <p className="text-sm font-bold text-slate-900">
                    {status === "Eligible for Payout" || status === "Payout Processing" || status === "Payout Completed"
                      ? <span className="text-emerald-700 flex items-center gap-1.5"><CheckCircle2 size={14}/> Eligible</span>
                      : status === "Payout Failed"
                      ? <span className="text-red-700 flex items-center gap-1.5"><XCircle size={14}/> Failed — Verify UPI</span>
                      : <span className="text-slate-400 flex items-center gap-1.5"><Clock size={14}/> Not yet eligible</span>}
                  </p>
                </div>
                {(status==="Eligible for Payout"||status==="Payout Processing"||status==="Payout Completed") && (
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400 mb-0.5">Amount</p>
                    <p className="text-2xl font-black text-emerald-700">₹500</p>
                  </div>
                )}
              </div>

              {status !== "Submitted" && status !== "Under Review" && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">UPI ID (masked)</p>
                  <p className="text-sm font-bold text-slate-900">rahul****@upi</p>
                </div>
              )}

              {status === "Payout Processing" && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Loader2 size={15} className="text-indigo-600 spinner"/>
                    <p className="font-bold text-indigo-800 text-sm">Processing via Razorpay</p>
                  </div>
                  <p className="text-indigo-700 text-xs">Ref: RZP-2025XXXXXX · Expected within 24–48 working hours.</p>
                </div>
              )}

              {status === "Payout Completed" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <p className="font-bold text-emerald-800 text-sm mb-1 flex items-center gap-2">
                    <ShieldCheck size={15}/> ₹500 Credited Successfully
                  </p>
                  <p className="text-emerald-700 text-xs">Razorpay Ref: RZP-2025XXXXXX · {new Date().toLocaleDateString("en-IN")}</p>
                </div>
              )}

              {status === "Payout Failed" && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="font-bold text-red-800 text-sm mb-1 flex items-center gap-2"><AlertTriangle size={15}/>Payout Failed</p>
                  <p className="text-red-700 text-xs mb-2">UPI ID could not be verified. Update your UPI in Testbook app profile.</p>
                  <a href="mailto:creator-support@testbook.com" className="text-xs text-blue-700 font-bold hover:underline">
                    Contact Support →
                  </a>
                </div>
              )}

              {(status==="Submitted"||status==="Under Review") && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-400 text-center">
                  Payout details available after your video is approved and view target is met.
                </div>
              )}
            </div>
          </div>

          {/* ── Quick actions ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { href:"/sop",    icon:BookOpen,   label:"SOP Guide",  sub:"Creation guide" },
              { href:"/submit", icon:Upload,     label:"Submit",     sub:"New video" },
              { href:"mailto:creator-support@testbook.com", icon:Headphones, label:"Support", sub:"Get help" },
            ].map(({ href, icon:Ic, label, sub:s }) => (
              <Link key={label} href={href} className="card card-hover p-4 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Ic size={18} className="text-blue-600" strokeWidth={2}/>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">{label}</p>
                  <p className="text-[10px] text-slate-400">{s}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <div className="h-16 md:hidden"/>
    </div>
  );
}
