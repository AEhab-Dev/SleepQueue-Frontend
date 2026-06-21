"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

// Floating particle component
function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      initial={{ y: "110vh", opacity: 0, x }}
      animate={{ y: "-10vh", opacity: [0, 0.6, 0.6, 0], x: [x, x + 30, x - 20, x] }}
      transition={{ duration: 8 + delay, repeat: Infinity, delay, ease: "linear" }}
      style={{ width: size, height: size }}
      className="absolute rounded-full bg-blue-500/20 blur-sm pointer-events-none"
    />
  );
}

// Glitch text component
function GlitchText({ text }: { text: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block select-none">
      <span className="text-[clamp(6rem,20vw,16rem)] font-black tracking-tighter text-white/[0.03] leading-none">
        {text}
      </span>
      {glitching && (
        <>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 text-[clamp(6rem,20vw,16rem)] font-black tracking-tighter text-red-500/10 leading-none"
            style={{ clipPath: "inset(30% 0 50% 0)", transform: "translate(-4px, 2px)" }}
          >
            {text}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="absolute inset-0 text-[clamp(6rem,20vw,16rem)] font-black tracking-tighter text-blue-500/10 leading-none"
            style={{ clipPath: "inset(60% 0 20% 0)", transform: "translate(4px, -2px)" }}
          >
            {text}
          </motion.span>
        </>
      )}
    </div>
  );
}

// Orbiting avatar component
function OrbitingAvatar({
  label, color, angle, radius, duration,
}: { label: string; color: string; angle: number; radius: number; duration: number }) {
  const [deg, setDeg] = useState(angle);

  useAnimationFrame((_, delta) => {
    setDeg((prev) => prev + (delta / 1000) * (360 / duration));
  });

  const rad = (deg * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <motion.div
      style={{ x, y, position: "absolute", top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
      whileHover={{ scale: 1.3 }}
    >
      <motion.div
        className="w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black text-white shadow-lg cursor-pointer"
        style={{ background: color, boxShadow: `0 0 20px ${color}60` }}
        animate={{ rotate: -deg }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

// Animated code line
function CodeLine({ code, delay }: { code: any; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3 }}
      className="font-mono text-[11px] leading-relaxed"
    >
      {code}
    </motion.div>
  );
}

export default function NotFound() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left - rect.width / 2) / 30);
      mouseY.set((e.clientY - rect.top - rect.height / 2) / 30);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  const particles = [
    { delay: 0, x: 80, size: 6 }, { delay: 1.5, x: 200, size: 4 },
    { delay: 3, x: 350, size: 8 }, { delay: 0.8, x: 500, size: 5 },
    { delay: 2.2, x: 650, size: 7 }, { delay: 4, x: 900, size: 4 },
    { delay: 1, x: 1100, size: 6 }, { delay: 2.8, x: 1300, size: 5 },
  ];

  const orbiters = [
    { label: "JS",  color: "#ca8a04", angle: 0,   radius: 110, duration: 12 },
    { label: "TS",  color: "#2563eb", angle: 72,  radius: 110, duration: 12 },
    { label: "PY",  color: "#16a34a", angle: 144, radius: 110, duration: 12 },
    { label: "C++", color: "#7c3aed", angle: 216, radius: 110, duration: 12 },
    { label: "AI",  color: "#db2777", angle: 288, radius: 110, duration: 12 },
  ];

  const codeLines = [
    { code: <><span className="text-purple-400">try</span> <span className="text-white/40">{"{"}</span></>, delay: 0.5 },
    { code: <><span className="text-white/20">{"  "}</span><span className="text-blue-400">navigate</span><span className="text-white/40">(</span><span className="text-green-400">&apos;/destination&apos;</span><span className="text-white/40">)</span></>, delay: 0.8 },
    { code: <><span className="text-white/40">{"}"}</span> <span className="text-purple-400">catch</span> <span className="text-white/40">(</span><span className="text-orange-400">err</span><span className="text-white/40">) {"{"}</span></>, delay: 1.1 },
    { code: <><span className="text-white/20">{"  "}</span><span className="text-red-400">throw</span> <span className="text-white/40">new</span> <span className="text-yellow-400">Error</span><span className="text-white/40">(</span><span className="text-green-400">&apos;404&apos;</span><span className="text-white/40">)</span></>, delay: 1.4 },
    { code: <><span className="text-white/40">{"}"}</span></>, delay: 1.7 },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden flex flex-col items-center justify-center p-6 relative"
    >
      {/* Particles Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.18, 0.08], x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600 blur-[160px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.14, 0.06], x: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600 blur-[160px] rounded-full"
        />
      </div>

      {/* Mouse parallax layer */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="relative z-10 text-center max-w-4xl w-full"
      >
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-red-500"
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500">
            Runtime Exception · Status 404
          </span>
        </motion.div>

        {/* Central orbital system */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
          {/* Orbit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
            className="relative flex-shrink-0"
            style={{ width: 280, height: 280 }}
          >
            {[110, 80, 50].map((r, i) => (
              <motion.div
                key={r}
                className="absolute top-1/2 left-1/2 rounded-full border border-white/5"
                style={{ width: r * 2, height: r * 2, x: "-50%", y: "-50%" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
              />
            ))}

            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl z-10"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(59,130,246,0.3)",
                  "0 0 60px rgba(139,92,246,0.5)",
                  "0 0 30px rgba(59,130,246,0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <span className="text-2xl font-black font-mono">{`</>`}</span>
            </motion.div>

            {mounted && orbiters.map((o) => <OrbitingAvatar key={o.label} {...o} />)}

            {/* FIXED: Error badge animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [-3, 3, -3] }}
              transition={{ 
                scale: { type: "spring", delay: 1 },
                rotate: { type: "keyframes", duration: 0.5, repeat: Infinity, ease: "linear" }
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black rounded-full px-2 py-1 z-20 uppercase tracking-wider"
            >
              ERR
            </motion.div>
          </motion.div>

          {/* Right side content */}
          <div className="flex flex-col items-start gap-6 max-w-sm">
            <div className="relative">
              <GlitchText text="404" />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-zinc-900/80 border border-white/5 rounded-2xl p-4 w-full backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[10px] text-gray-600 font-mono">error.ts</span>
              </div>
              <div className="space-y-0.5">
                {codeLines.map((line, i) => (
                  <CodeLine key={i} code={line.code} delay={line.delay} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mb-4"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-purple-400">
              Page not found.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto"
        >
          The route you requested doesn&apos;t exist. <span className="text-blue-400">Every great engineer</span> hits dead ends — the key is <span className="text-purple-400 font-medium">recovering gracefully.</span>
        </motion.p>

        {/* CTA */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-white text-black px-10 py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase overflow-hidden"
            >
              <span className="relative flex items-center gap-3">
                Initialize Recovery
                <motion.svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="3" fill="none" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <path d="M3 12h18M15 18l6-6-6-6" />
                </motion.svg>
              </span>
            </motion.button>
          </Link>
          <button onClick={() => window.history.back()} className="px-8 py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase border border-white/10 text-gray-400 hover:text-white transition-colors">
            Go Back
          </button>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ delay: 2 }} className="mt-20 text-[9px] tracking-[0.5em] font-bold uppercase text-zinc-600">
          Ahmed Ehab · E-JUST · 2026
        </motion.p>
      </motion.div>
    </div>
  );
}