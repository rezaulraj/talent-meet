import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const STEPS = [
  {
    title: "Share the Brief",
    desc: "Tell us the role, the numbers, the timeline. We ask the questions that actually matter before we source anyone.",
    color: "#2632E0",
    icon: (
      <path d="M9 12h6M9 16h6M9 8h3M6 4h12a2 2 0 012 2v14l-4-3-4 3-4-3-4 3V6a2 2 0 012-2z" />
    ),
  },
  {
    title: "Source & Shortlist",
    desc: "We pull from our existing pipeline and run new sourcing in parallel — you get options, not one resume.",
    color: "#01C2FB",
    icon: (
      <path d="M11 4a7 7 0 104.2 12.6l4.6 4.6M11 4a7 7 0 016.2 10.2M11 4a7 7 0 00-7 7" />
    ),
  },
  {
    title: "Screen & Verify",
    desc: "Background checks, skills tests, reference calls — done before a single name reaches your inbox.",
    color: "#027A68",
    icon: (
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zM9 12l2 2 4-4" />
    ),
  },
  {
    title: "Interview & Select",
    desc: "You meet exactly who you want to meet, when you want to. We coordinate every moving part around it.",
    color: "#F8AF3C",
    icon: (
      <path d="M8 12a4 4 0 118 0 4 4 0 01-8 0zM3 20c0-3 2.5-5 5-5M21 20c0-3-2.5-5-5-5" />
    ),
  },
  {
    title: "Offer & Documentation",
    desc: "Contracts, visas, work permits — chased down in the background so a signed offer never stalls for months.",
    color: "#D50042",
    icon: (
      <path d="M6 3h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM14 3v5h5M9 14l2 2 4-4" />
    ),
  },
  {
    title: "Onboard & Support",
    desc: "We stay involved past day one — checking in until the hire is actually settled, not just delivered.",
    color: "#50A153",
    icon: (
      <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 3.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zM19 8v6M22 11h-6" />
    ),
  },
];

function buildPath(n) {
  const unit = 100;
  let d = "";
  const xFor = (i) => (i % 2 === 0 ? 32 : 68);
  for (let i = 0; i < n; i++) {
    const x = xFor(i);
    const y = i * unit + unit / 2;
    if (i === 0) {
      d += `M ${x} ${y} `;
    } else {
      const prevX = xFor(i - 1);
      const prevY = (i - 1) * unit + unit / 2;
      const midY = (prevY + y) / 2;
      d += `C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y} `;
    }
  }
  return d;
}

const ProcessSteps = () => {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const n = STEPS.length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pathEl = pathRef.current;
      const length = pathEl.getTotalLength();
      pathEl.style.strokeDasharray = length;
      pathEl.style.strokeDashoffset = length;

      const trigger = {
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom 60%",
        scrub: 0.6,
      };

      gsap.to(pathEl, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          ...trigger,
          onUpdate: (self) => {
            const idx = Math.min(n - 1, Math.floor(self.progress * n));
            dotRef.current.style.fill = STEPS[idx].color;
            dotRef.current.style.filter = `drop-shadow(0 0 6px ${STEPS[idx].color}aa)`;
          },
        },
      });

      gsap.to(dotRef.current, {
        motionPath: {
          path: pathEl,
          align: pathEl,
          alignOrigin: [0.5, 0.5],
        },
        ease: "none",
        scrollTrigger: trigger,
      });

      gsap.to(".hiw-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      ScrollTrigger.batch(".hiw-step", {
        start: "top 82%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          }),
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-primary-bg px-6 py-24 font-arimo sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-3xl translate-y-4 text-center opacity-0 hiw-header">
        <span className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-bold tracking-[0.2em] text-ink-light">
          <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
          HOW IT WORKS
        </span>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.01em] text-black sm:text-[2.8rem]">
          Six steps. One case, start to finish.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-ink-light">
          The dot on the left is a real placement moving through our process —
          the same six stages, every time.
        </p>
      </div>

      <div className="relative mx-auto mt-16 flex max-w-4xl">
        <div className="relative w-20 shrink-0 sm:w-28">
          <svg
            viewBox={`0 0 100 ${n * 100}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <path
              d={buildPath(n)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-ink/12"
            />
            <path
              ref={pathRef}
              d={buildPath(n)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-ink/70"
            />
            <circle ref={dotRef} r="6" fill="#2632E0" />
          </svg>
        </div>

        <div className="flex-1">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="hiw-step flex h-[220px] max-w-lg -translate-x-6 items-center gap-5 opacity-0 sm:gap-6"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${s.color}1a` }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  {s.icon}
                </svg>
              </div>
              <div>
                <span
                  className="text-[12px] font-bold tracking-[0.1em]"
                  style={{ color: s.color }}
                >
                  STEP {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-[19px] font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-light">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
