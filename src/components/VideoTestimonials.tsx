"use client";
import { useState } from "react";
import { Play, X, Star, Eye, ThumbsUp, IndianRupee, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { YoutubeIcon, InstagramIcon } from "@/components/BrandIcons";

interface Testimonial {
  id: number;
  name: string;
  exam: string;
  city: string;
  platform: "YouTube Shorts" | "Instagram Reels";
  earned: string;
  views: string;
  likes: string;
  avatarColor: string;
  initials: string;
  quote: string;
  thumbnailGradient: string;
  thumbnailEmoji: string;
  duration: string;
  videoTitle: string;
  script: string[];
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    exam: "SSC CGL 2024",
    city: "Lucknow, UP",
    platform: "YouTube Shorts",
    earned: "₹500",
    views: "24,800",
    likes: "1.2K",
    avatarColor: "#7c3aed",
    initials: "PS",
    quote: "Maine socha tha ki ek chhota sa video kya karega. Lekin 24,000+ views aaye aur ₹500 seedha UPI mein aa gaya! Testbook Pass ne meri preparation bhi ki aur earning bhi.",
    thumbnailGradient: "from-purple-600 to-blue-700",
    thumbnailEmoji: "📚",
    duration: "0:58",
    videoTitle: "Testbook Pass se crack kiya SSC CGL | My Experience",
    script: [
      "Hi dosto, main Priya hoon Lucknow se. SSC CGL ki preparation kar rahi thi...",
      "Coaching afford nahi ho rahi thi, toh Testbook Pass try kiya. Ek hi jagah mock tests, PYQs, live classes sab kuch...",
      "Pehle month mein hi mera score 45% se 68% ho gaya! Mock tests ne sach mein game change kar diya...",
      "Agar aap bhi government exam ki taiyari kar rahe hain, toh Testbook Pass zaroor try karein. Link description mein hai!",
    ],
    stars: 5,
  },
  {
    id: 2,
    name: "Rahul Verma",
    exam: "Railway NTPC",
    city: "Patna, Bihar",
    platform: "Instagram Reels",
    earned: "₹200",
    views: "8,400",
    likes: "640",
    avatarColor: "#0891b2",
    initials: "RV",
    quote: "Ek 60-second ka reel banaya, uss par 8000+ views aaye aur ₹200 mila. Paise bhi mile aur dosto ne bhi thank you bola ki useful tha!",
    thumbnailGradient: "from-cyan-500 to-blue-600",
    thumbnailEmoji: "🚂",
    duration: "1:02",
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
    id: 3,
    name: "Anjali Patel",
    exam: "Bank PO (IBPS)",
    city: "Surat, Gujarat",
    platform: "YouTube Shorts",
    earned: "₹500",
    views: "31,200",
    likes: "2.1K",
    avatarColor: "#059669",
    initials: "AP",
    quote: "Mujhe expect hi nahi tha itne views aayenge. 30,000+ views aur full ₹500 payout! Testbook ka creator program genuinely ek side income ka great option hai students ke liye.",
    thumbnailGradient: "from-emerald-500 to-teal-600",
    thumbnailEmoji: "🏦",
    duration: "0:52",
    videoTitle: "Bank PO 2024 | Testbook Pass se kaise kari preparation",
    script: [
      "IBPS PO ki preparation ki baat karein — sab log keh rahe the coaching lo, coaching lo...",
      "Maine Testbook Pass liya. Reasoning, Quant, English — sab sections ke liye dedicated tests hain...",
      "3 mahine mein meri speed double ho gayi. Prelims clear kar li maine!",
      "Aap bhi try karo. Description mein link hai. All the best exam warriors!",
    ],
    stars: 5,
  },
  {
    id: 4,
    name: "Mohit Yadav",
    exam: "UPSC CSE",
    city: "Jaipur, Rajasthan",
    platform: "YouTube Shorts",
    earned: "₹1,500",
    views: "1,12,000",
    likes: "8.4K",
    avatarColor: "#dc2626",
    initials: "MY",
    quote: "Viral ho gaya mera video! 1 lakh+ views aaye aur ₹1,500 payout mila. Sabse achi baat — bahut saare aspirants ne message kiya ki unhe helpful laga. Double khushi!",
    thumbnailGradient: "from-red-500 to-orange-600",
    thumbnailEmoji: "🇮🇳",
    duration: "1:15",
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
    ? <YoutubeIcon size={14} color="#ef4444" />
    : <InstagramIcon size={14} color="#e1306c" />;
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

export default function VideoTestimonials() {
  const [active, setActive] = useState<Testimonial | null>(null);
  const [playing, setPlaying] = useState(false);
  const [scriptLine, setScriptLine] = useState(0);

  const openVideo = (t: Testimonial) => {
    setActive(t);
    setPlaying(false);
    setScriptLine(0);
  };

  const handlePlay = () => {
    setPlaying(true);
    setScriptLine(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setScriptLine(i);
      if (i >= (active?.script.length ?? 0) - 1) clearInterval(interval);
    }, 2200);
  };

  const close = () => { setActive(null); setPlaying(false); setScriptLine(0); };

  const navigate = (dir: 1 | -1) => {
    if (!active) return;
    const idx = testimonials.findIndex(t => t.id === active.id);
    const next = testimonials[(idx + dir + testimonials.length) % testimonials.length];
    openVideo(next);
  };

  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Real Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">
            Watch Videos made by your Fellow Aspirants
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Watch how students just like you created videos and got paid — real submissions, real payouts.
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="card overflow-hidden group">

              {/* Video thumbnail */}
              <div className={`relative bg-gradient-to-br ${t.thumbnailGradient} aspect-video cursor-pointer`}
                onClick={() => openVideo(t)}>

                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="text-5xl">{t.thumbnailEmoji}</span>
                  <p className="text-white text-xs font-bold text-center px-6 leading-relaxed drop-shadow">
                    {t.videoTitle}
                  </p>
                </div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play size={24} fill="#1a3ed4" color="#1a3ed4" className="ml-1" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  {t.duration}
                </div>

                {/* Earnings badge */}
                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                  <IndianRupee size={10} strokeWidth={3} />
                  {t.earned} earned
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                    style={{ background: t.avatarColor }}>
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-black text-slate-900 text-sm">{t.name}</p>
                      <StarRating count={t.stars} />
                    </div>
                    <p className="text-[11px] text-slate-400">{t.exam} · {t.city}</p>
                  </div>
                  <div className="ml-auto shrink-0 flex items-center gap-1">
                    <PlatformIcon platform={t.platform} />
                    <span className="text-[11px] text-slate-400">{t.platform.split(" ")[0]}</span>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative pl-4 border-l-2 border-blue-200 mb-3">
                  <Quote size={12} className="text-blue-300 absolute -left-1.5 -top-1" fill="currentColor" />
                  <p className="text-slate-600 text-xs leading-relaxed italic">{t.quote}</p>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Eye size={11} /> {t.views} views</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={11} /> {t.likes} likes</span>
                  <button onClick={() => openVideo(t)}
                    className="ml-auto text-blue-700 font-bold hover:underline flex items-center gap-1">
                    <Play size={11} fill="currentColor" /> Watch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Video Modal ── */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={(e) => e.target === e.currentTarget && close()}>

          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-sm shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PlatformIcon platform={active.platform} />
                <span className="text-xs font-bold text-slate-500">{active.platform}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(-1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => navigate(1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <ChevronRight size={16} />
                </button>
                <button onClick={close}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Phone video area — fixed 9:16 portrait, centered in modal */}
            <div className={`relative bg-gradient-to-br ${active.thumbnailGradient} overflow-hidden mx-auto`}
              style={{ height: "280px", width: "157px" }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

              {/* Before play */}
              {!playing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
                  <span className="text-6xl">{active.thumbnailEmoji}</span>
                  <p className="text-white text-sm font-bold text-center leading-snug drop-shadow">
                    {active.videoTitle}
                  </p>
                  <button onClick={handlePlay}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform mt-2">
                    <Play size={28} fill="#1a3ed4" color="#1a3ed4" className="ml-1" />
                  </button>
                  <p className="text-white/70 text-xs">Tap to watch demo</p>
                </div>
              )}

              {/* Playing — simulated script */}
              {playing && (
                <div className="absolute inset-0 flex flex-col justify-end p-5 gap-3">
                  {/* Avatar speaking */}
                  <div className="flex items-end gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0"
                      style={{ background: active.avatarColor }}>
                      {active.initials}
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl rounded-bl-none px-4 py-3 flex-1">
                      <p className="text-white text-xs leading-relaxed font-medium">
                        {active.script[scriptLine] ?? active.script[active.script.length - 1]}
                      </p>
                    </div>
                  </div>

                  {/* Progress dots */}
                  <div className="flex gap-1.5 justify-center pb-1">
                    {active.script.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i <= scriptLine ? "bg-white w-6" : "bg-white/30 w-3"}`} />
                    ))}
                  </div>
                </div>
              )}

              {/* Duration */}
              <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {active.duration}
              </div>

              {/* Earnings badge */}
              <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <IndianRupee size={10} strokeWidth={3} /> {active.earned} earned
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black"
                  style={{ background: active.avatarColor }}>{active.initials}</div>
                <div>
                  <p className="font-black text-slate-900 text-sm">{active.name}</p>
                  <p className="text-[11px] text-slate-400">{active.exam} · {active.city}</p>
                </div>
                <StarRating count={active.stars} />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: Eye,        label: "Views",  val: active.views },
                  { icon: ThumbsUp,   label: "Likes",  val: active.likes },
                  { icon: IndianRupee,label: "Earned", val: active.earned },
                ].map(({ icon: Ic, label, val }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-2 text-center">
                    <Ic size={14} className="text-blue-600 mx-auto mb-0.5" strokeWidth={2} />
                    <p className="text-xs font-black text-slate-900">{val}</p>
                    <p className="text-[10px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 text-xs leading-relaxed italic border-l-2 border-blue-200 pl-3 mb-4">
                &ldquo;{active.quote}&rdquo;
              </p>
              {!playing &&
                <button onClick={handlePlay} className="btn-primary w-full text-sm py-2.5">
                  <Play size={15} fill="white" /> Watch Demo Script
                </button>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
