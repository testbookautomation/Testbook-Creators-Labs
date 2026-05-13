import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Smartphone, Lock, Video, Upload, CheckCircle, IndianRupee,
  Play, Star, Users, Clock, ChevronRight, TrendingUp,
  AlertCircle, ArrowRight, Zap, Shield, Award, HelpCircle
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import VideoTestimonials from "@/components/VideoTestimonials";

const steps = [
  { icon: Smartphone, num: "01", title: "Open campaign link", desc: "Use the Testbook app, banner, or notification link. Your phone and user ID can be pre-filled automatically." },
  { icon: Lock, num: "02", title: "Verify account", desc: "Login with OTP so each submission is linked to a valid Testbook account." },
  { icon: Video, num: "03", title: "Create your video", desc: "Record a 30-90 second reel or short explaining your exam prep journey and Testbook Pass experience." },
  { icon: Upload, num: "04", title: "Submit for review", desc: "Post the video publicly, paste the link, and submit it for campaign review." },
  { icon: CheckCircle, num: "05", title: "Get approved", desc: "The team reviews the video and starts tracking performance once it meets the guidelines." },
  { icon: IndianRupee, num: "06", title: "Receive payout", desc: "Eligible videos are paid directly to UPI after they cross the required view milestone." },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Active creators" },
  { icon: TrendingUp, value: "Rs 500+", label: "Average earning" },
  { icon: Clock, value: "48 hrs", label: "Review window" },
  { icon: Shield, value: "100%", label: "Verified flow" },
];

const platforms = [
  { icon: YoutubeIcon, name: "YouTube Shorts", tag: "Recommended", tagColor: "#ef4444" },
  { icon: InstagramIcon, name: "Instagram Reels", tag: "Popular", tagColor: "#e1306c" },
  { icon: FacebookIcon, name: "Facebook Reels", tag: "Accepted", tagColor: "#1877f2" },
];

const tiers = [
  { views: "5,000+", earn: "Rs 200", label: "Starter", color: "border-l-slate-300" },
  { views: "20,000+", earn: "Rs 500", label: "Standard", color: "border-l-blue-500", highlight: true },
  { views: "1,00,000+", earn: "Rs 1,500+", label: "Viral", color: "border-l-orange-400" },
];

const faqs = [
  { q: "Who can participate?", a: "Any registered Testbook user with an active account and a phone number linked to Testbook.com can join the campaign." },
  { q: "What should my video be about?", a: "Share your government exam preparation story, the problem you faced, how Testbook Pass helped, and why other aspirants should try it." },
  { q: "When will I get paid?", a: "Once your video is approved and crosses the required view count, the payout is processed to your UPI ID within 24-48 working hours." },
  { q: "My UPI ID is missing. What do I do?", a: "Update your UPI ID in the Testbook app under Profile and Payment Settings before your video becomes eligible for payout." },
  { q: "Can I submit more than one video?", a: "Currently one submission per campaign is allowed. Follow the SOP carefully and submit your strongest video." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fb]">
      <Navbar />

      <section className="bg-[linear-gradient(145deg,#07133f_0%,#102c9c_55%,#1d4ed8_100%)] text-white px-4 pt-8 pb-8 sm:pt-14 sm:pb-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.08fr_.92fr] gap-7 sm:gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white text-slate-900 rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-bold mb-5 sm:mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse" />
              Official student creator campaign
            </div>

            <h1 className="text-[32px] sm:text-5xl lg:text-[56px] font-black leading-[1.08] sm:leading-[1.05] tracking-tight max-w-2xl">
              Earn by creating videos for Testbook Pass
            </h1>
            <p className="text-sm sm:text-lg text-blue-100 mt-4 sm:mt-5 leading-relaxed max-w-xl">
              Share your preparation story, help other aspirants discover Testbook Pass, and receive verified campaign payouts when your video performs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
              <Link href="/login" className="btn-orange text-base px-7 w-full sm:w-auto">
                Start campaign <ArrowRight size={18} />
              </Link>
              <Link href="/sop" className="inline-flex items-center justify-center gap-2 min-h-12 rounded-lg border border-white/25 bg-white/5 px-7 text-base font-semibold text-white transition hover:bg-white/10 hover:border-white/50 w-full sm:w-auto">
                <Play size={16} /> View SOP
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-7 sm:mt-10 max-w-2xl">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="border border-white/15 bg-white/10 px-3 py-3 sm:px-4 sm:py-4 rounded-lg">
                  <Icon size={17} className="mb-2 sm:mb-3 text-orange-200" />
                  <div className="text-lg sm:text-xl font-black">{value}</div>
                  <div className="text-[10px] sm:text-[11px] text-blue-100 font-semibold mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white text-slate-900 p-4 sm:p-7 shadow-2xl shadow-blue-950/20">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 sm:pb-5">
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                <Image src="/testbook-logo.png" alt="Testbook" width={4500} height={913} className="h-7 sm:h-8 w-auto" priority />
              </div>
              <span className="badge badge-green">Live</span>
            </div>

            <div className="py-5 sm:py-6 border-b border-slate-100">
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Creator brief</p>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">Publish one clear, authentic short video.</h2>
              <p className="text-sm text-slate-500 leading-relaxed mt-2">
                Explain your exam preparation challenge, introduce Testbook Pass, and guide aspirants to try it.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-5 sm:py-6 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">Video length</p>
                <p className="text-base sm:text-lg font-black">30-90 sec</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">Format</p>
                <p className="text-base sm:text-lg font-black">9:16 public</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">Review</p>
                <p className="text-base sm:text-lg font-black">24-48 hrs</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">Payout</p>
                <p className="text-base sm:text-lg font-black">UPI</p>
              </div>
            </div>

            <div className="pt-5 space-y-3">
              {["Mention Testbook Pass by name", "Use clear audio and a public video link", "Keep UPI updated in the Testbook app"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Process</span>
              <h2 className="text-[26px] sm:text-3xl font-black text-slate-950 mt-3">6 steps to start earning</h2>
            </div>
            <p className="text-slate-500 text-sm max-w-md">A clear path from campaign login to video review and payout.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map(({ icon: Icon, num, title, desc }) => (
              <div key={num} className="card card-hover p-4 sm:p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-black text-slate-300">{num}</span>
                </div>
                <h3 className="font-bold text-slate-950 text-[15px] mb-1.5 capitalize">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-4 bg-[#f7f8fb]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[.95fr_1.05fr] gap-8 items-start">
          <div>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest">Content guide</span>
            <h2 className="text-[26px] sm:text-3xl font-black text-slate-950 mt-3 mb-3">What your video should include</h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
              Keep the story practical, honest, and useful for government exam aspirants.
            </p>
            <Link href="/sop" className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900 text-sm mt-6">
              View full SOP guide <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: AlertCircle, color: "text-blue-600", text: "Start with your exam preparation struggle" },
              { icon: Zap, color: "text-orange-500", text: "Explain how Testbook Pass solved that problem" },
              { icon: Star, color: "text-yellow-500", text: "Share a genuine personal experience" },
              { icon: Users, color: "text-emerald-600", text: "Motivate other aspirants to begin" },
              { icon: Award, color: "text-purple-600", text: "Add required hashtags and caption" },
            ].map(({ icon: Icon, color, text }) => (
              <div key={text} className="card p-4 flex items-start gap-3">
                <Icon size={18} className={`${color} shrink-0 mt-0.5`} strokeWidth={2} />
                <p className="text-slate-700 text-sm font-semibold leading-relaxed">{text}</p>
              </div>
            ))}

            <div className="card p-5 md:row-span-2">
              <h3 className="font-bold text-slate-950 mb-4 text-[15px]">Supported platforms</h3>
              <div className="space-y-3">
                {platforms.map(({ icon: Icon, name, tag, tagColor }) => (
                  <div key={name} className="flex items-center justify-between gap-3 border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Icon size={22} color={tagColor} />
                      <span className="font-semibold text-slate-800 text-sm">{name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: tagColor }}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Payouts</span>
            <h2 className="text-[26px] sm:text-3xl font-black text-slate-950 mt-3 mb-2">How much can you earn?</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">Payouts are based on view count after your video is approved.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map(({ views, earn, label, color, highlight }) => (
              <div key={label} className={`card border-l-4 ${color} p-5 ${highlight ? "ring-2 ring-blue-100" : ""}`}>
                <div className="text-sm text-slate-400 font-bold mb-3">{label}</div>
                <div className="font-bold text-slate-900 flex items-center gap-2 mb-5">
                  <TrendingUp size={15} className="text-blue-600" />
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

      <section className="py-10 sm:py-14 px-4 bg-[#f7f8fb]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-slate-600 bg-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">FAQ</span>
            <h2 className="text-[26px] sm:text-3xl font-black text-slate-950 mt-3">Common questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <div key={q} className="card p-5">
                <div className="flex gap-3">
                  <HelpCircle size={18} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={2} />
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

      <section className="bg-slate-950 py-10 sm:py-14 px-4 text-white text-center">
        <div className="max-w-lg mx-auto">
          <Award size={40} className="mx-auto mb-4 text-orange-300" />
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to start creating?</h2>
          <p className="text-slate-300 text-sm mb-8 max-w-sm mx-auto">
            Join the campaign and submit your strongest Testbook Pass video.
          </p>
          <Link href="/login" className="btn-orange text-base px-10 py-4 inline-flex">
            Join the campaign <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
      <div className="h-16 md:hidden" />
    </div>
  );
}
