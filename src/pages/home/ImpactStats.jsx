import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INK = "23,27,46";

const STATS = [
  {
    label: "AVG. DAYS TO FILL A ROLE",
    target: 18,
    suffix: "",
    color: "#2632E0",
  },
  { label: "EMPLOYERS SERVED", target: 340, suffix: "+", color: "#01C2FB" },
  { label: "CLIENTS WHO RETURN", target: 92, suffix: "%", color: "#027A68" },
  { label: "YEARS IN OPERATION", target: 14, suffix: "+", color: "#F8AF3C" },
];

const RING_R = 42;
const RING_C = 2 * Math.PI * RING_R;

const ImpactStats = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const numRefs = useRef([]);
  const ringRefs = useRef([]);
  const glowRefs = useRef([]);

  // ambient rising-bars canvas, idle motion plus a scroll-driven boost
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, dpr, raf;
    const start = performance.now();
    const bars = 16;
    const colors = [
      "#2632E0",
      "#01C2FB",
      "#027A68",
      "#F8AF3C",
      "#D50042",
      "#50A153",
    ];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame(now) {
      const t = (now - start) / 1000;
      const progress = progressRef.current;
      ctx.clearRect(0, 0, W, H);
      const bw = W / bars;
      for (let i = 0; i < bars; i++) {
        const idle = (Math.sin(t * 0.5 + i * 0.7) + 1) / 2;
        const h = H * 0.06 + H * 0.4 * progress * idle;
        ctx.fillStyle = `${colors[i % colors.length]}30`;
        ctx.fillRect(i * bw + bw * 0.25, H - h, bw * 0.5, h);
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".impact-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      const proxies = STATS.map(() => ({ val: 0 }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "bottom 45%",
          scrub: 0.6,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      STATS.forEach((s, i) => {
        tl.to(
          proxies[i],
          {
            val: s.target,
            ease: "none",
            onUpdate: () => {
              const el = numRefs.current[i];
              const ring = ringRefs.current[i];
              const glow = glowRefs.current[i];
              const frac = proxies[i].val / s.target;
              if (el)
                el.textContent =
                  Math.round(proxies[i].val).toLocaleString() + s.suffix;
              if (ring) ring.style.strokeDashoffset = RING_C * (1 - frac);
              if (glow) glow.style.opacity = 0.5 * frac;
            },
          },
          0,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary-bg px-6 py-28 font-arimo sm:px-8 lg:px-12"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full opacity-70"
      />

      <div className="relative z-10 mx-auto max-w-3xl translate-y-4 text-center opacity-0 impact-header">
        <span className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-semibold tracking-[0.2em] text-ink-light">
          <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
          THE NUMBERS
        </span>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.01em] text-black sm:text-[2.8rem]">
          Keep scrolling. The numbers fill in as you go.
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center text-center">
            <div className="relative h-28 w-28">
              <span
                ref={(el) => (glowRefs.current[i] = el)}
                className="pointer-events-none absolute inset-[-20%] rounded-full opacity-0 blur-2xl transition-opacity"
                style={{ backgroundColor: s.color }}
              />
              <svg
                viewBox="0 0 100 100"
                className="relative h-full w-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={RING_R}
                  fill="none"
                  stroke={`rgba(${INK},0.1)`}
                  strokeWidth="5"
                />
                <circle
                  ref={(el) => (ringRefs.current[i] = el)}
                  cx="50"
                  cy="50"
                  r={RING_R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C}
                />
              </svg>
              <span
                ref={(el) => (numRefs.current[i] = el)}
                className="absolute inset-0 flex items-center justify-center text-[1.6rem] font-bold text-ink"
              >
                0
              </span>
            </div>
            <p className="mt-4 max-w-[9rem] text-[12px] font-semibold leading-snug tracking-[0.06em] text-ink-light">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactStats;
