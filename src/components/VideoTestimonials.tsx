"use client";
import { useState } from "react";
import {
  Play, X, Star, Eye, ThumbsUp, IndianRupee,
  ChevronLeft, ChevronRight, Quote, MapPin,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon } from "@/components/BrandIcons";

interface Testimonial {
  id: number; name: string; exam: string; city: string;
  platform: "YouTube Shorts" | "Instagram Reels";
  earned: string; views: string; likes: string;
  avatarColor: string; initials: string; quote: string;
  thumbnailGradient: string; thumbnailEmoji: string;
  duration: string; videoTitle: string;
  script: string[]; stars: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1, name: "Priya Sharma", exam: "SSC CGL 2024", city: "Lucknow, UP",
    platform: "YouTube Shorts", earned: "₹500", views: "24,800", likes: "1.2K",
    avatarColor: "#7c3aed", initials: "PS",
    quote: "Maine socha tha ki ek chhota sa video kya karega. Lekin 24,000+ views aaye aur ₹500 seedha UPI mein aa gaya! Testbook Pass ne meri preparation bhi ki aur earning bhi.",
    thumbnailGradient: "from-purple-600 to-blue-700",
    thumbnailEmoji: "📚", duration: "0:58",
    videoTitle: "Testbook Pass se crack kiya SSC CGL | My Experience",
    script: [
      "Hi dosto, main Priya hoon Lucknow se. SSC CGL ki preparation kar rahi thi...",
      "Coaching afford nahi ho rahi thi, toh Testbook Pass try kiya. Mock tests, PYQs, live classes sab ek jagah...",
      "Pehle month mein hi mera score 45% se 68% ho gaya! Mock tests ne game change kar diya...",
      "Agar aap bhi government exam ki taiyari kar rahe hain, toh Testbook Pass zaroor try karein!",
    ],
    stars: 5,
  },
  {
    id: 2, name: "Rahul Verma", exam: "Railway NTPC", city: "Patna, Bihar",
    platform: "Instagram Reels", earned: "₹200", views: "8,400", likes: "640",
    avatarColor: "#0891b2", initials: "RV",
    quote: "Ek 60-second ka reel banaya, uss par 8000+ views aaye aur ₹200 mila. Paise bhi mile aur dosto ne bhi thank you bola ki useful tha!",
    thumbnailGradient: "from-cyan-500 to-blue-600",
    thumbnailEmoji: "🚂", duration: "1:02",
    videoTitle: "Railway NTPC ki taiyari | Testbook Pass honest review",
    script: [
      "Yaar, Railway NTPC ki preparation mein bahut struggle ho raha tha...",
      "Testbook Pass join kiya — previous year papers, topic-wise tests, sab available hai...",
      "Ab daily 2 mock tests deta hoon. Confidence level bahut badh gaya hai...",
      "Tumhare liye bhi helpful hoga. Comment mein batao kaunsa exam de rahe ho!",
    ],
    stars: 5,
  },
  {
    id: 3, name: "Anjali Patel", exam: "Bank PO (IBPS)", city: "Surat, Gujarat",
    platform: "YouTube Shorts", earned: "₹500", views: "31,200", likes: "2.1K",
    avatarColor: "#059669", initials: "AP",
    quote: "Mujhe expect hi nahi tha itne views aayenge. 30,000+ views aur full ₹500 payout! Testbook ka creator program genuinely ek side income ka great option hai.",
    thumbnailGradient: "from-emerald-500 to-teal-600",
    thumbnailEmoji: "🏦", duration: "0:52",
    videoTitle: "Bank PO 2024 | Testbook Pass se kaise kari preparation",
    script: [
      "IBPS PO ki preparation ki baat karein — sab log keh rahe the coaching lo...",
      "Maine Testbook Pass liya. Reasoning, Quant, English — sab sections ke liye dedicated tests...",
      "3 mahine mein meri speed double ho gayi. Prelims clear kar li maine!",
      "Aap bhi try karo. Description mein link hai. All the best exam warriors!",
    ],
    stars: 5,
  },
  {
    id: 4, name: "Mohit Yadav", exam: "UPSC CSE", city: "Jaipur, Rajasthan",
    platform: "YouTube Shorts", earned: "₹1,500", views: "1,12,000", likes: "8.4K",
    avatarColor: "#dc2626", initials: "MY",
    quote: "Viral ho gaya mera video! 1 lakh+ views aaye aur ₹1,500 payout mila. Bahut saare aspirants ne message kiya ki unhe helpful laga. Double khushi!",
    thumbnailGradient: "from-red-500 to-orange-600",
    thumbnailEmoji: "🇮🇳", duration: "1:15",
    videoTitle: "UPSC Aspirant ki kahani | Testbook Pass honest review",
    script: [
      "UPSC ki journey sabse tough hoti hai. Limited resources, unlimited syllabus...",
      "Testbook Pass ne mera approach badal diya. Current affairs, NCERT summaries, PYQs — ek jagah sab...",
      "Mains preparation mein answer writing practice bhi kar paya. Bohot valuable content hai...",
      "Fellow aspirants — ek baar zaroor try karo. Aapka preparation level alag hi hoga!",
    ],
    stars: 5,
  },
];

function PlatformIcon({ platform }: { platform: Testimonial["platform"] }) {
  return platform === "YouTube Shorts"
    ? <YoutubeIcon size={13} color="#ef4444" />
    : <InstagramIcon size={13} color="#e1306c" />;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />
      ))}
    </div>
  );
}

const earnedBg: Record<string, string> = {
  "₹200":   "bg-blue-500",
  "₹500":   "bg-emerald-500",
  "₹1,500": "bg-orange-500",
};

export default function VideoTestimonials() {
  const [active, setActive]       = useState<Testimonial | null>(null);
  const [playing, setPlaying]     = useState(false);
  const [scriptLine, setScriptLine] = useState(0);

  const openVideo = (t: Testimonial) => {
    setActive(t); setPlaying(false); setScriptLine(0);
  };

  const handlePlay = () => {
    setPlaying(true); setScriptLine(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setScriptLine(i);
      if (i >= (active?.script.length ?? 0) - 1) clearInterval(interval);
    }, 2200);
  };

  const close    = () => { setActive(null); setPlaying(false); setScriptLine(0); };
  const navigate = (dir: 1 | -1) => {
    if (!active) return;
    const idx  = testimonials.findIndex(t => t.id === active.id);
    const next = testimonials[(idx + dir + testimonials.length) % testimonials.length];
    openVideo(next);
  };

  return (
    <section className="py-14 px-4 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-tag text-emerald-700 bg-emerald-50">Real Stories</span>
          <h2 className="text-[26px] sm:text-3xl font-black text-slate-900 mt-3 mb-2">
            Students Who Already Earned
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Real submissions, real payouts — from students just like you.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id}
              className="card overflow-hidden group cursor-pointer
                hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              onClick={() => openVideo(t)}>

              {/* Thumbnail */}
              <div className={`relative bg-gradient-to-br ${t.thumbnailGradient} aspect-video`}>
                {/* Dot pattern overlay */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                {/* Dark gradient at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
                  <span className="text-5xl drop-shadow-lg">{t.thumbnailEmoji}</span>
                  <p className="text-white text-xs font-bold text-center leading-relaxed
                    drop-shadow max-w-[180px]">
                    {t.videoTitle}
                  </p>
                </div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center
                    justify-center shadow-xl ring-4 ring-white/30
                    group-hover:scale-110 group-hover:bg-white transition-all duration-200">
                    <Play size={22} fill="#1d4ed8" color="#1d4ed8" className="ml-1" />
                  </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-2.5 right-2.5 glass-dark text-white
                  text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {t.duration}
                </div>

                {/* Earnings badge */}
                <div className={`absolute top-2.5 left-2.5 ${earnedBg[t.earned] || "bg-emerald-500"}
                  text-white text-[11px] font-black px-2.5 py-1 rounded-full
                  flex items-center gap-1 shadow-md`}>
                  <IndianRupee size={10} strokeWidth={3} />
                  {t.earned} earned
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 bg-white">
                {/* Author row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center
                    text-white text-xs font-black shrink-0 ring-2 ring-white shadow-sm"
                    style={{ background: t.avatarColor }}>
                    {t.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-slate-900 text-sm">{t.name}</p>
                      <StarRating count={t.stars} />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin size={10} />
                      {t.exam} · {t.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <PlatformIcon platform={t.platform} />
                    <span className="text-[10px] text-slate-400 font-medium">
                      {t.platform.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative pl-4 border-l-2 border-blue-100 mb-3">
                  <Quote size={10} className="text-blue-200 absolute -left-1 top-0"
                    fill="currentColor" />
                  <p className="text-slate-500 text-xs leading-relaxed">{t.quote}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-[11px] text-slate-400
                  pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-semibold">
                    <Eye size={12} className="text-blue-500" /> {t.views}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <ThumbsUp size={12} className="text-rose-400" /> {t.likes}
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-blue-700 font-bold
                    group-hover:underline">
                    <Play size={10} fill="currentColor" /> Watch
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Video Modal ───────────────────────────────── */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(2,6,23,.88)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && close()}>

          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-[340px]
            shadow-2xl fade-up">

            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PlatformIcon platform={active.platform} />
                <span className="text-xs font-bold text-slate-600">{active.platform}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => navigate(-1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200
                    flex items-center justify-center transition-colors">
                  <ChevronLeft size={15} />
                </button>
                <button onClick={() => navigate(1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200
                    flex items-center justify-center transition-colors">
                  <ChevronRight size={15} />
                </button>
                <button onClick={close}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100
                    flex items-center justify-center transition-colors text-slate-500 hover:text-red-600">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Phone video area — fixed 9:16 portrait, centered in modal */}
            <div className={`relative bg-gradient-to-br ${active.thumbnailGradient}
              overflow-hidden mx-auto`}
              style={{ height: "280px", width: "157px" }}>
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Before play */}
              {!playing && (
                <div className="absolute inset-0 flex flex-col items-center
                  justify-center gap-3 px-5">
                  <span className="text-6xl drop-shadow-lg">{active.thumbnailEmoji}</span>
                  <p className="text-white text-sm font-bold text-center leading-snug drop-shadow max-w-[200px]">
                    {active.videoTitle}
                  </p>
                  <button onClick={handlePlay}
                    className="w-16 h-16 bg-white rounded-full flex items-center
                      justify-center shadow-2xl ring-4 ring-white/20
                      hover:scale-105 transition-transform mt-1">
                    <Play size={26} fill="#1d4ed8" color="#1d4ed8" className="ml-1" />
                  </button>
                  <p className="text-white/60 text-xs font-medium">Tap to watch demo</p>
                </div>
              )}

              {/* Playing */}
              {playing && (
                <div className="absolute inset-0 flex flex-col justify-end p-4 gap-3">
                  <div className="flex items-end gap-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center
                      text-white text-xs font-black shrink-0"
                      style={{ background: active.avatarColor }}>
                      {active.initials}
                    </div>
                    <div className="glass-dark rounded-2xl rounded-bl-none px-4 py-3 flex-1">
                      <p className="text-white text-xs leading-relaxed font-medium">
                        {active.script[scriptLine] ?? active.script[active.script.length - 1]}
                      </p>
                    </div>
                  </div>
                  {/* Progress dots */}
                  <div className="flex gap-1.5 justify-center pb-0.5">
                    {active.script.map((_, i) => (
                      <div key={i}
                        className={`h-1 rounded-full transition-all duration-500
                          ${i <= scriptLine ? "bg-white w-6" : "bg-white/30 w-2.5"}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Overlay badges */}
              <div className="absolute top-2.5 right-2.5 glass-dark text-white
                text-[10px] font-bold px-2 py-0.5 rounded-md">
                {active.duration}
              </div>
              <div className={`absolute top-2.5 left-2.5 ${earnedBg[active.earned] || "bg-emerald-500"}
                text-white text-[11px] font-black px-2.5 py-1 rounded-full
                flex items-center gap-1`}>
                <IndianRupee size={9} strokeWidth={3} /> {active.earned} earned
              </div>
            </div>

            {/* Modal body */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center
                  text-white text-sm font-black ring-2 ring-white shadow-sm"
                  style={{ background: active.avatarColor }}>
                  {active.initials}
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 text-sm">{active.name}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <MapPin size={10} /> {active.exam} · {active.city}
                  </div>
                </div>
                <StarRating count={active.stars} />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: Eye,         label: "Views",  val: active.views,  color: "text-blue-600",   bg: "bg-blue-50" },
                  { icon: ThumbsUp,    label: "Likes",  val: active.likes,  color: "text-rose-500",   bg: "bg-rose-50" },
                  { icon: IndianRupee, label: "Earned", val: active.earned, color: "text-emerald-600",bg: "bg-emerald-50" },
                ].map(({ icon: Ic, label, val, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-2.5 text-center`}>
                    <Ic size={14} className={`${color} mx-auto mb-0.5`} strokeWidth={2} />
                    <p className="text-xs font-black text-slate-900">{val}</p>
                    <p className="text-[10px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-500 text-xs leading-relaxed italic
                border-l-2 border-blue-100 pl-3 mb-4">
                &ldquo;{active.quote}&rdquo;
              </p>

              {!playing && (
                <button onClick={handlePlay} className="btn-primary w-full text-sm py-2.5">
                  <Play size={14} fill="white" /> Watch Demo Script
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
