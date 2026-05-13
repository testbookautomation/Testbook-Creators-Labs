"use client";
import { useState, useEffect, useRef } from "react";
import {
  Play, Pause, RotateCcw, Volume2, CheckCircle2, XCircle,
  Clock, Mic, Camera, ChevronRight, Lightbulb, AlertTriangle
} from "lucide-react";

const SCRIPT = [
  {
    time: "0:00 – 0:10",
    label: "Hook — State your struggle",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    speaker: "Rahul",
    text: "\"Yaar, main 2 saal se government exam ki preparation kar raha tha. Coaching afford nahi ho rahi thi, aur ghar pe paise ki bhi tension thi...\"",
    tip: "Start with emotion. Viewers instantly connect when you share a real struggle.",
    emoji: "😔",
  },
  {
    time: "0:10 – 0:30",
    label: "Solution — Introduce Testbook Pass",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
    speaker: "Rahul",
    text: "\"Tab mere ek dost ne Testbook Pass suggest kiya. Pehle socha kya hoga... but try kiya. Mock tests, PYQs, live classes — sab ek jagah tha. Aur price mein? Coaching se kaafi sasta!\"",
    tip: "Name specific features. Generic praise feels fake — specifics feel real.",
    emoji: "💡",
  },
  {
    time: "0:30 – 0:50",
    label: "Result — Show your transformation",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    speaker: "Rahul",
    text: "\"3 mahine ki practice ke baad mera SSC CGL prelims score 40% se 72% ho gaya! Daily 2 mock tests deta hoon. Improvement clearly dikh raha hai result mein.\"",
    tip: "Numbers build credibility — share your score improvement or test count.",
    emoji: "📈",
  },
  {
    time: "0:50 – 1:05",
    label: "CTA — Motivate & direct viewers",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
    speaker: "Rahul",
    text: "\"Agar aap bhi government exam ki preparation kar rahe hain, toh Testbook Pass ek baar zaroor try karo. Description mein link hai. All the best, exam warriors!\"",
    tip: "Always end with a clear action. Mention the description link explicitly.",
    emoji: "🎯",
  },
];

const GOOD = [
  "Clear face, good natural light",
  "Speaks directly to camera",
  "Honest, conversational tone",
  "Mentions Testbook Pass by name",
  "Required hashtags in caption",
  "Video posted publicly",
];

const BAD = [
  "Dark or blurry background",
  "Reads from a script (robotic)",
  "Vague claims like 'best app'",
  "Testbook Pass not mentioned",
  "No hashtags in caption",
  "Video kept private",
];

export default function DemoVideo() {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const STEP_DURATIONS = [10, 20, 20, 15]; // seconds per step
  const TOTAL = STEP_DURATIONS.reduce((a, b) => a + b, 0); // 65s

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        if (next >= TOTAL) {
          setPlaying(false);
          setStep(SCRIPT.length - 1);
          return TOTAL;
        }
        // compute which step
        let acc = 0;
        for (let i = 0; i < STEP_DURATIONS.length; i++) {
          acc += STEP_DURATIONS[i];
          if (next < acc) { setStep(i); break; }
        }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const handlePlay = () => {
    if (elapsed >= TOTAL) reset();
    setPlaying(true);
    if (step < 0) setStep(0);
  };

  const reset = () => {
    setPlaying(false);
    setStep(-1);
    setElapsed(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pct = (elapsed / TOTAL) * 100;

  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Demo Video
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">
            See Exactly How Your Video Should Look
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Press play below to walk through a sample winning video — with the script, timing, and tips for each section.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── Phone mockup ── */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[260px] mx-auto">

              {/* Phone shell */}
              <div className="bg-slate-900 rounded-[36px] p-2.5 shadow-2xl">
                {/* Notch */}
                <div className="flex justify-center mb-1.5">
                  <div className="w-20 h-5 bg-slate-800 rounded-full flex items-center justify-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                  </div>
                </div>

                {/* Screen */}
                <div className="bg-slate-800 rounded-[28px] overflow-hidden aspect-[9/16] relative">

                  {/* Idle state */}
                  {step < 0 && (
                    <div className="absolute inset-0 tb-gradient flex flex-col items-center justify-center gap-4 px-5">
                      <div className="text-5xl">🎬</div>
                      <p className="text-white text-xs font-bold text-center leading-snug">
                        SSC CGL Aspirant shares Testbook Pass experience
                      </p>
                      <button onClick={handlePlay}
                        className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                        <Play size={22} fill="#1a3ed4" color="#1a3ed4" className="ml-1" />
                      </button>
                      <span className="text-white/60 text-[10px]">Tap to preview</span>
                    </div>
                  )}

                  {/* Playing state */}
                  {step >= 0 && (
                    <div className={`absolute inset-0 flex flex-col transition-colors duration-700`}
                      style={{ background: step < SCRIPT.length ? SCRIPT[step].color + "22" : "#1a3ed4" }}>

                      {/* Top overlay — creator info */}
                      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black border-2 border-white">RV</div>
                        <div>
                          <p className="text-white text-[11px] font-bold leading-none">Rahul Verma</p>
                          <p className="text-white/70 text-[9px]">SSC CGL Aspirant</p>
                        </div>
                        <div className="ml-auto">
                          <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">● LIVE DEMO</span>
                        </div>
                      </div>

                      {/* Center content */}
                      <div className="flex-1 flex items-center justify-center px-4">
                        <div key={step} className="text-center animate-pulse">
                          <div className="text-4xl mb-3">{SCRIPT[step]?.emoji ?? "🎯"}</div>
                          <p className="text-white text-[11px] font-semibold leading-relaxed bg-black/30 rounded-xl px-3 py-2 backdrop-blur-sm">
                            {SCRIPT[step]?.text ?? ""}
                          </p>
                        </div>
                      </div>

                      {/* Bottom controls */}
                      <div className="px-3 pb-4 space-y-2">
                        {/* Section label */}
                        <div className="text-center">
                          <span className="text-white/70 text-[9px] font-bold uppercase tracking-widest">
                            {SCRIPT[step]?.label}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                          <div className="h-1 bg-white rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%` }} />
                        </div>

                        <div className="flex justify-between text-[9px] text-white/60">
                          <span>{fmtTime(elapsed)}</span>
                          <span>{fmtTime(TOTAL)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Home indicator */}
                <div className="flex justify-center mt-1.5">
                  <div className="w-20 h-1 bg-slate-700 rounded-full" />
                </div>
              </div>

              {/* Controls below phone */}
              <div className="flex items-center justify-center gap-3 mt-5">
                <button onClick={reset}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <RotateCcw size={16} className="text-slate-600" />
                </button>
                <button
                  onClick={() => playing ? setPlaying(false) : handlePlay()}
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 btn-primary">
                  {playing ? <Pause size={22} /> : <Play size={22} fill="white" className="ml-0.5" />}
                </button>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Volume2 size={16} className="text-slate-400" />
                </div>
              </div>

              <p className="text-center text-[11px] text-slate-400 mt-3">Interactive demo — press play</p>
            </div>
          </div>

          {/* ── Script timeline ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-blue-600" strokeWidth={2} />
              <h3 className="font-black text-slate-900">Script Breakdown</h3>
            </div>

            {SCRIPT.map((s, i) => (
              <div key={i}
                className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${step === i ? "scale-[1.01] shadow-md" : "hover:border-slate-300"}`}
                style={{
                  borderColor: step === i ? s.color : "#e2e8f0",
                  background: step === i ? s.bg : "#fff",
                }}
                onClick={() => { setPlaying(false); setStep(i); setElapsed(STEP_DURATIONS.slice(0, i).reduce((a, b) => a + b, 0)); }}>

                <div className="flex items-start gap-3">
                  {/* Step indicator */}
                  <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black"
                    style={{ background: s.color }}>
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock size={9} /> {s.time}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{s.label}</span>
                      {step === i && (
                        <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-full"
                          style={{ background: s.color }}>ACTIVE</span>
                      )}
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed mb-2 italic">{s.text}</p>

                    <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                      <Lightbulb size={12} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-amber-800 text-[11px] leading-snug">{s.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Video tips strip ── */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: Camera,  color:"#3b82f6", bg:"#eff6ff", title:"Face the Camera",   desc:"Look directly at camera — not at yourself on screen." },
            { icon: Mic,     color:"#7c3aed", bg:"#faf5ff", title:"Clear Audio",        desc:"Record in a quiet room. Avoid fan or street noise." },
            { icon: Clock,   color:"#f97316", bg:"#fff7ed", title:"30–90 Seconds",      desc:"Keep it tight. Every second should add value." },
          ].map(({ icon: Ic, color, bg, title, desc }) => (
            <div key={title} className="card p-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                <Ic size={18} color={color} strokeWidth={2} />
              </div>
              <p className="font-bold text-slate-900 text-sm mb-1">{title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Good vs bad comparison ── */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-emerald-600" strokeWidth={2.5} />
              <h3 className="font-black text-emerald-900">Approved videos have…</h3>
            </div>
            <ul className="space-y-2">
              {GOOD.map(g => (
                <li key={g} className="flex items-center gap-2.5 text-sm text-emerald-900">
                  <ChevronRight size={13} className="text-emerald-500 shrink-0" strokeWidth={3} />
                  {g}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-red-600" strokeWidth={2.5} />
              <h3 className="font-black text-red-900">Rejected videos have…</h3>
            </div>
            <ul className="space-y-2">
              {BAD.map(b => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-red-900">
                  <XCircle size={13} className="text-red-400 shrink-0" strokeWidth={2.5} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
