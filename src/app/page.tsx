import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroCTA, BottomCTA } from "@/components/CampaignCTA";
import {
  Smartphone, Lock, Video, Upload, CheckCircle, IndianRupee,
  Star, Users, Clock, ChevronRight, TrendingUp,
  AlertCircle, Zap, Shield, Award, HelpCircle,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import VideoTestimonials from "@/components/VideoTestimonials";

const steps = [
  { icon: Smartphone, num: "01", title: "Open campaign link",   desc: "Use the Testbook app, banner, or notification link. Your phone and user ID can be pre-filled automatically." },
  { icon: Lock,       num: "02", title: "Verify account",       desc: "Login with OTP so each submission is linked to a valid Testbook account." },
  { icon: Video,      num: "03", title: "Create your video",    desc: "Record a 30-90 second reel or short explaining your exam prep journey and Testbook Pass experience." },
  { icon: Upload,     num: "04", title: "Submit for review",    desc: "Post the video publicly, paste the link, and submit it for campaign review." },
  { icon: CheckCircle,num: "05", title: "Get approved",         desc: "The team reviews the video and starts tracking performance once it meets the guidelines." },
  { icon: IndianRupee,num: "06", title: "Receive payout",       desc: "Eligible videos are paid directly to UPI after they cross the required view milestone." },
];

const stats = [
  { icon: Users,     value: "10,000+", label: "Active creators" },
  { icon: TrendingUp,value: "Rs 500+", label: "Average earning" },
  { icon: Clock,     value: "48 hrs",  label: "Review window" },
  { icon: Shield,    value: "100%",    label: "Verified flow" },
];

const platforms = [
  { icon: YoutubeIcon,   name: "YouTube Shorts",  tag: "Recommended", tagColor: "#ef4444" },
  { icon: InstagramIcon, name: "Instagram Reels", tag: "Popular",     tagColor: "#e1306c" },
  { icon: FacebookIcon,  name: "Facebook Reels",  tag: "Accepted",    tagColor: "#1877f2" },
];

const tiers = [
  { views: "5,000+",    earn: "Rs 200",   label: "Starter",  accent: "border-l-slate-300" },
  { views: "20,000+",   earn: "Rs 500",   label: "Standard", accent: "border-l-blue-500",   highlight: true },
  { views: "1,00,000+", earn: "Rs 1,500+",label: "Viral",    accent: "border-l-orange-400" },
];

const faqs = [
  { q: "Who can participate?",             a: "Any registered Testbook user with an active account and a phone number linked to Testbook.com can join the campaign." },
  { q: "What should my video be about?",   a: "Share your government exam preparation story, the problem you faced, how Testbook Pass helped, and why other aspirants should try it." },
  { q: "When will I get paid?",            a: "Once your video is approved and crosses the required view count, the payout is processed to your UPI ID within 24-48 working hours." },
  { q: "My UPI ID is missing. What do I do?", a: "Update your UPI ID in the Testbook app under Profile and Payment Settings before your video becomes eligible for payout." },
  { q: "Can I submit more than one video?",a: "Currently one submission per campaign is allowed. Follow the SOP carefully and submit your strongest video." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="tb-gradient text-white px-4 pt-10 pb-10 sm:pt-16 sm:pb-14">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-white text-slate-900 rounded-full
              px-3.5 py-1.5 text-[11px] sm:text-xs font-bold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse" />
              Official student creator campaign
            </div>

            <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-[52px] font-black
              leading-[1.08] tracking-tight max-w-2xl">
              Earn by creating videos for{" "}
              <span className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #fdba74 0%, #fb923c 50%, #f97316 100%)",
                }}>
                Testbook Pass
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-blue-100 mt-4 sm:mt-5 leading-relaxed max-w-xl">
              Share your preparation story, help other aspirants discover Testbook Pass, and receive
              verified campaign payouts when your video performs.
            </p>

            <HeroCTA />

            {/* Stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2.5 mt-8 sm:mt-10">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label}
                  className="glass rounded-xl px-3 py-4 group
                    hover:bg-white/15 transition-colors duration-150">
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center
                    justify-center mb-3 group-hover:bg-white/20 transition-colors">
                    <Icon size={15} className="text-orange-200" />
                  </div>
                  <div className="text-lg sm:text-xl font-black leading-none">{value}</div>
                  <div className="text-[10px] sm:text-[11px] text-blue-200 font-semibold mt-1.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creator brief card */}
          <div className="card bg-white text-slate-900 p-5 sm:p-7 shadow-2xl shadow-blue-950/25">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                <Image
                  src="/testbook-logo.png" alt="Testbook"
                  width={4500} height={913} className="h-7 sm:h-8 w-auto" priority
                />
              </div>
              <span className="badge badge-green">Live</span>
            </div>

            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Creator brief
            </p>
            <h2 className="text-xl sm:text-[22px] font-black text-slate-950 mb-2">
              Publish one clear, authentic short video.
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Explain your exam preparation challenge, introduce Testbook Pass, and guide aspirants to try it.
            </p>

            <div className="grid grid-cols-2 gap-3 pb-5 border-b border-slate-100 mb-5">
              {[
                { l: "Video length", v: "30-90 sec" },
                { l: "Format",       v: "9:16 public" },
                { l: "Review",       v: "24-48 hrs" },
                { l: "Payout",       v: "UPI direct" },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="text-[10px] text-slate-400 font-bold mb-0.5">{l}</p>
                  <p className="text-base sm:text-lg font-black text-slate-900">{v}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              {[
                "Mention Testbook Pass by name",
                "Use clear audio and a public video link",
                "Keep UPI updated in the Testbook app",
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8 sm:mb-10">
            <div>
              <span className="section-tag text-blue-700 bg-blue-50">Process</span>
              <h2 className="text-2xl sm:text-[26px] lg:text-3xl font-black text-slate-950 mt-3">
                6 steps to start earning
              </h2>
            </div>
            <p className="text-slate-500 text-sm max-w-sm md:text-right">
              A clear path from campaign login to video review and payout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map(({ icon: Icon, num, title, desc }) => (
              <div key={num} className="card card-hover p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700
                    flex items-center justify-center shrink-0">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-black text-slate-200">{num}</span>
                </div>
                <h3 className="font-bold text-slate-950 text-[15px] mb-1.5 capitalize">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content guide ─────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[.95fr_1.05fr] gap-8 lg:gap-10 items-start">
          <div>
            <span className="section-tag text-orange-700 bg-orange-50">Content guide</span>
            <h2 className="text-2xl sm:text-[26px] lg:text-3xl font-black text-slate-950 mt-3 mb-3">
              What your video should include
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
              Keep the story practical, honest, and useful for government exam aspirants.
            </p>
            <Link href="/sop"
              className="inline-flex items-center gap-2 font-bold text-blue-700
                hover:text-blue-900 text-sm mt-6 transition-colors">
              View full SOP guide <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: AlertCircle, color: "text-blue-600",   text: "Start with your exam preparation struggle" },
              { icon: Zap,         color: "text-orange-500", text: "Explain how Testbook Pass solved that problem" },
              { icon: Star,        color: "text-yellow-500", text: "Share a genuine personal experience" },
              { icon: Users,       color: "text-emerald-600",text: "Motivate other aspirants to begin" },
              { icon: Award,       color: "text-purple-600", text: "Add required hashtags and caption" },
            ].map(({ icon: Icon, color, text }) => (
              <div key={text} className="card p-4 flex items-start gap-3">
                <Icon size={17} className={`${color} shrink-0 mt-0.5`} strokeWidth={2} />
                <p className="text-slate-700 text-sm font-semibold leading-relaxed">{text}</p>
              </div>
            ))}

            {/* Platforms card */}
            <div className="card p-5 md:row-span-2">
              <h3 className="font-bold text-slate-950 mb-4 text-sm">Supported platforms</h3>
              <div className="space-y-3">
                {platforms.map(({ icon: Icon, name, tag, tagColor }) => (
                  <div key={name}
                    className="flex items-center justify-between gap-3
                      border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Icon size={22} color={tagColor} />
                      <span className="font-semibold text-slate-800 text-sm">{name}</span>
                    </div>
                    <span
                      className="text-[11px] font-bold text-white px-2.5 py-1 rounded-full"
                      style={{ background: tagColor }}>
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Payout tiers ─────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-tag text-emerald-700 bg-emerald-50">Payouts</span>
            <h2 className="text-[26px] sm:text-3xl font-black text-slate-950 mt-3 mb-2">
              How much can you earn?
            </h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Payouts are based on view count after your video is approved.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map(({ views, earn, label, accent, highlight }) => (
              <div key={label}
                className={`card border-l-4 ${accent} p-5
                  ${highlight ? "ring-2 ring-blue-100 shadow-md shadow-blue-50" : ""}`}>
                {highlight && (
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold
                    text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full mb-3">
                    ★ Most common
                  </div>
                )}
                <div className="text-xs text-slate-400 font-bold mb-2">{label}</div>
                <div className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-sm">
                  <TrendingUp size={14} className="text-blue-600" />
                  {views} views
                </div>
                <div className="text-3xl font-black text-blue-700">{earn}</div>
                <div className="text-[11px] text-slate-400 mt-1">UPI payout</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Payout amounts are indicative. Final eligibility is determined by campaign terms.
          </p>
        </div>
      </section>

      <VideoTestimonials />

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-tag text-slate-600 bg-slate-200">FAQ</span>
            <h2 className="text-[26px] sm:text-3xl font-black text-slate-950 mt-3">Common questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <div key={q} className="card p-5">
                <div className="flex gap-3">
                  <HelpCircle size={17} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="font-bold text-slate-950 text-sm mb-1.5">{q}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────── */}
      <section className="bg-slate-950 py-12 sm:py-16 px-4 text-white text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-14 h-14 bg-orange-500/15 rounded-2xl flex items-center justify-center
            mx-auto mb-5">
            <Award size={28} className="text-orange-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to start creating?</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Join the campaign and submit your strongest Testbook Pass video.
          </p>
          <BottomCTA />
        </div>
      </section>

      <Footer />
      <div className="h-16 md:hidden" />
    </div>
  );
}
