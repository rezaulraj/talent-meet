import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Each service gets a motion metaphor that means something, not a random
// decorative loop — the animation is a one-glance explanation of the service.
const SERVICES = [
  {
    title: "Workforce Sourcing",
    url: "/services/workforce-sourcing",
    desc: "Building the pipeline before you need it — vetted talent ready the moment a role opens.",
    pattern: "network",
    color: "#2632E0",
  },
  {
    title: "Overseas Recruitment",
    url: "/services/overseas-recruitment",
    desc: "Cross-border hiring without the paperwork nightmare, start to finish.",
    pattern: "orbit",
    color: "#01C2FB",
  },
  {
    title: "Executive Search",
    url: "/services/executive-search",
    desc: "Leadership roles filled by search, not by whoever applied first.",
    pattern: "scan",
    color: "#D50042",
  },
  {
    title: "Bulk Hiring",
    url: "/services/bulk-hiring",
    desc: "Fifty roles or five hundred — the same rigor, at real speed.",
    pattern: "burst",
    color: "#F8AF3C",
  },
  {
    title: "Permanent Staffing",
    url: "/services/permanent-staffing",
    desc: "Long-term hires who are still there in year three.",
    pattern: "anchor",
    color: "#027A68",
  },
  {
    title: "Temporary Staffing",
    url: "/services/temporary-staffing",
    desc: "Flexible coverage for seasonal surges and sudden gaps.",
    pattern: "cycle",
    color: "#50A153",
  },
  {
    title: "Recruitment Process Outsourcing (RPO)",
    url: "/services/rpo",
    desc: "Hand us the whole hiring function. You keep the final say.",
    pattern: "gears",
    color: "#2632E0",
  },
  {
    title: "Candidate Screening",
    url: "/services/candidate-screening",
    desc: "Background checks and reference calls done before you ever see a CV.",
    pattern: "checklist",
    color: "#01C2FB",
  },
  {
    title: "Trade Testing & Assessment",
    url: "/services/trade-testing",
    desc: "Certified skills, verified on-site — not just claimed on paper.",
    pattern: "bars",
    color: "#F8AF3C",
  },
  {
    title: "Payroll & HR Solutions",
    url: "/services/payroll-hr",
    desc: "Compliant payroll across borders, run quietly in the background.",
    pattern: "flow",
    color: "#027A68",
  },
  {
    title: "Visa & Documentation Support",
    url: "/services/visa-support",
    desc: "Every permit and stamp chased down before it becomes a delay.",
    pattern: "stamp",
    color: "#D50042",
  },
  {
    title: "Relocation & Onboarding",
    url: "/services/relocation",
    desc: "Getting people settled in, not just dropped off.",
    pattern: "arrive",
    color: "#50A153",
  },
];

// ---- shared drawing helpers -------------------------------------------------
function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

function draw(ctx, w, h, t, color, pattern, seed, active) {
  const cx = w / 2,
    cy = h / 2;
  const boost = active ? 1 : 0;

  switch (pattern) {
    case "network": {
      const n = 9;
      const pts = Array.from({ length: n }, (_, i) => {
        const a = seed * 10 + i * 1.4;
        return {
          x: cx + Math.sin(t * 0.4 + a) * (w * 0.32),
          y: cy + Math.cos(t * 0.33 + a * 1.3) * (h * 0.3),
        };
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 70) {
            ctx.strokeStyle = hexToRgba(color, (1 - d / 70) * 0.35);
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, 0.9);
        ctx.fill();
      });
      break;
    }

    case "orbit": {
      // a dot tracing a long low arc, like a flight path between two points
      const progress = (t * 0.25) % 1;
      const x = w * 0.1 + progress * w * 0.8;
      const arcH = Math.sin(progress * Math.PI) * h * 0.35;
      const y = h * 0.75 - arcH;
      ctx.strokeStyle = hexToRgba(color, 0.25);
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.75);
      ctx.quadraticCurveTo(cx, h * 0.75 - h * 0.35 * 1.3, w * 0.9, h * 0.75);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 3 + boost * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      [0.1, 0.9].forEach((px) => {
        ctx.beginPath();
        ctx.arc(w * px, h * 0.75, 3, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, 0.5);
        ctx.fill();
      });
      break;
    }

    case "scan": {
      const angle = t * (1 + boost * 0.8);
      const r = Math.min(w, h) * 0.4;
      const grad = ctx.createConicGradient
        ? ctx.createConicGradient(angle, cx, cy)
        : null;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(color, 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + 0.9);
      ctx.closePath();
      ctx.fillStyle = grad || hexToRgba(color, 0.18);
      if (grad) {
        grad.addColorStop(0, hexToRgba(color, 0.35));
        grad.addColorStop(1, hexToRgba(color, 0));
      }
      ctx.fill();
      ctx.restore();
      // three fixed "candidates" that light up as the sweep passes
      [0.6, 2.1, 4.3].forEach((phase) => {
        const px = cx + Math.cos(phase) * r * 0.65;
        const py = cy + Math.sin(phase) * r * 0.65;
        const diff = Math.abs(
          ((angle - phase + Math.PI) % (Math.PI * 2)) - Math.PI,
        );
        const lit = diff < 0.5;
        ctx.beginPath();
        ctx.arc(px, py, lit ? 4 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = lit ? color : hexToRgba(color, 0.4);
        ctx.fill();
      });
      break;
    }

    case "burst": {
      const cycle = (t * 0.6) % 2;
      const p = Math.min(cycle, 1);
      const n = 10;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + seed * 6;
        const dist = p * Math.min(w, h) * 0.38;
        const x = cx + Math.cos(a) * dist;
        const y = cy + Math.sin(a) * dist;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, 1 - p);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      break;
    }

    case "anchor": {
      [0.35, 0.6, 0.85].forEach((f, i) => {
        const phase = (t * 0.3 + i * 0.33) % 1;
        ctx.beginPath();
        ctx.arc(cx, cy, phase * Math.min(w, h) * f, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(color, (1 - phase) * 0.4);
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      break;
    }

    case "cycle": {
      const segs = 8;
      const rot = t * (0.8 + boost * 0.6);
      const r = Math.min(w, h) * 0.32;
      for (let i = 0; i < segs; i++) {
        const a0 = rot + (i / segs) * Math.PI * 2;
        const a1 = a0 + 0.35;
        ctx.beginPath();
        ctx.arc(cx, cy, r, a0, a1);
        ctx.strokeStyle = hexToRgba(color, 0.35 + 0.5 * (i / segs));
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      break;
    }

    case "gears": {
      const r1 = Math.min(w, h) * 0.22;
      const r2 = r1 * 0.62;
      const cx1 = cx - r1 * 0.55,
        cx2 = cx + r1 * 0.7;
      [
        { x: cx1, r: r1, rot: t * 1.1, teeth: 8 },
        { x: cx2, r: r2, rot: -t * 1.6, teeth: 6 },
      ].forEach(({ x, r, rot, teeth }) => {
        for (let i = 0; i < teeth; i++) {
          const a = rot + (i / teeth) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(a) * r * 0.75, cy + Math.sin(a) * r * 0.75);
          ctx.lineTo(x + Math.cos(a) * r, cy + Math.sin(a) * r);
          ctx.strokeStyle = hexToRgba(color, 0.6);
          ctx.lineWidth = 2.4;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, cy, r * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(color, 0.4);
        ctx.stroke();
      });
      break;
    }

    case "checklist": {
      const rows = 5;
      const sweepY = ((t * 0.5) % 1.3) * h;
      for (let i = 0; i < rows; i++) {
        const y = h * 0.15 + i * (h * 0.16);
        const checked = sweepY > y;
        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(w * 0.28, y - 5, 10, 10, 3)
          : ctx.rect(w * 0.28, y - 5, 10, 10);
        ctx.fillStyle = checked ? color : "transparent";
        ctx.strokeStyle = hexToRgba(color, 0.5);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = hexToRgba(color, checked ? 0.5 : 0.2);
        ctx.beginPath();
        ctx.moveTo(w * 0.28 + 20, y);
        ctx.lineTo(w * 0.75, y);
        ctx.stroke();
      }
      ctx.strokeStyle = hexToRgba(color, 0.6);
      ctx.beginPath();
      ctx.moveTo(0, sweepY);
      ctx.lineTo(w, sweepY);
      ctx.stroke();
      break;
    }

    case "bars": {
      const n = 6;
      const bw = (w * 0.7) / n;
      for (let i = 0; i < n; i++) {
        const target = 0.3 + ((Math.sin(seed * 8 + i * 1.7) + 1) / 2) * 0.6;
        const grow = Math.min(1, (t * 0.5 - i * 0.12) % 2);
        const hgt = h * 0.75 * target * Math.max(0, Math.min(1, grow));
        ctx.fillStyle = hexToRgba(color, 0.75);
        ctx.fillRect(w * 0.15 + i * bw, h * 0.85 - hgt, bw * 0.55, hgt);
      }
      ctx.strokeStyle = hexToRgba(color, 0.2);
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.85);
      ctx.lineTo(w * 0.9, h * 0.85);
      ctx.stroke();
      break;
    }

    case "flow": {
      ctx.strokeStyle = hexToRgba(color, 0.15);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = cy + Math.sin(x * 0.05 + t) * (h * 0.12);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        const progress = (t * 0.35 + i * 0.25) % 1.2;
        if (progress > 1) continue;
        const x = progress * w;
        const y = cy + Math.sin(x * 0.05 + t) * (h * 0.12);
        ctx.beginPath();
        ctx.arc(x, y, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      break;
    }

    case "stamp": {
      const cycle = (t * 0.6) % 1.6;
      const impact = cycle < 0.15;
      const ringP = Math.max(0, Math.min(1, (cycle - 0.15) / 1));
      ctx.beginPath();
      ctx.arc(cx, cy, h * 0.22 * (1 + ringP * 0.9), 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(color, Math.max(0, 0.5 - ringP * 0.5));
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, h * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(color, impact ? 0.85 : 0.55);
      ctx.fill();
      break;
    }

    case "arrive": {
      const p = (t * 0.3) % 1;
      const sx = w * 0.12,
        sy = h * 0.85;
      const ex = w * 0.82,
        ey = h * 0.25;
      const cxp = w * 0.5,
        cyp = h * 0.1;
      const x = (1 - p) * (1 - p) * sx + 2 * (1 - p) * p * cxp + p * p * ex;
      const y = (1 - p) * (1 - p) * sy + 2 * (1 - p) * p * cyp + p * p * ey;
      ctx.strokeStyle = hexToRgba(color, 0.2);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cxp, cyp, ex, ey);
      ctx.stroke();
      // destination pin
      ctx.beginPath();
      ctx.arc(ex, ey, 5, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(color, 0.6);
      ctx.stroke();
      // traveling dot
      ctx.beginPath();
      ctx.arc(x, y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      break;
    }

    default:
      break;
  }
}

// ---- self-contained canvas component ---------------------------------------
const PatternCanvas = ({ pattern, color, active }) => {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const seed = Math.random() * 10;
    let W, H, dpr, raf;
    const start = performance.now();

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
      ctx.clearRect(0, 0, W, H);
      draw(ctx, W, H, t, color, pattern, seed, activeRef.current);
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pattern, color]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
};

// ---- main section ------------------------------------------------------------
const ServicesOverview = () => {
  const sectionRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".svc-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      ScrollTrigger.batch(".svc-card", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
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
      <div className="mx-auto max-w-3xl translate-y-4 text-center opacity-0 svc-header">
        <span className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-semibold tracking-[0.2em] text-ink-light">
          <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
          WHAT WE DO
        </span>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.01em] text-black sm:text-[2.8rem]">
          One partner, every stage of hiring.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-ink-light">
          From the first search to the day someone actually starts work — twelve
          services, one point of accountability.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <a
            key={s.title}
            href={s.url}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="svc-card group relative flex translate-y-6 flex-col overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white opacity-0 shadow-[0_10px_30px_-18px_rgba(23,27,46,0.18)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-22px_rgba(23,27,46,0.25)]"
          >
            <div
              className="relative h-36 w-full overflow-hidden"
              style={{ backgroundColor: hexToRgba(s.color, 0.05) }}
            >
              <PatternCanvas
                pattern={s.pattern}
                color={s.color}
                active={hovered === i}
              />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-[16.5px] font-semibold leading-snug text-black">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-light">
                {s.desc}
              </p>
              <span
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all duration-300 group-hover:gap-2.5"
                style={{ color: s.color }}
              >
                Learn more <span aria-hidden>→</span>
              </span>
            </div>

            <span
              className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
              style={{ backgroundColor: s.color }}
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default ServicesOverview;
