import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INDUSTRIES = [
  {
    title: "Healthcare",
    url: "/industries/healthcare",
    tagline:
      "Clinical staff who are credentialed before they ever see a shift.",
    color: "#D50042",
    image:
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&q=80",
    overlay: "heartbeat",
  },
  {
    title: "Construction",
    url: "/industries/construction",
    tagline: "Site-ready trades, tested before they're deployed, not after.",
    color: "#027A68",
    image:
      "https://images.unsplash.com/photo-1653280662710-1cac52cde6d7?auto=format&fit=crop&w=1200&q=80",
    overlay: "blueprint",
  },
  {
    title: "Manufacturing",
    url: "/industries/manufacturing",
    tagline: "Production-line staffing that scales up in days, not months.",
    color: "#50A153",
    image:
      "https://images.unsplash.com/photo-1742281692582-3507d7219c33?auto=format&fit=crop&w=1200&q=80",
    overlay: "gear",
  },
  {
    title: "Hospitality",
    url: "/industries/hospitality",
    tagline: "Front-of-house staff who make a property feel fully staffed.",
    color: "#F8AF3C",
    image:
      "https://images.unsplash.com/photo-1757889692998-d851b95f912e?auto=format&fit=crop&w=1200&q=80",
    overlay: "steam",
  },
  {
    title: "Logistics & Supply Chain",
    url: "/industries/logistics",
    tagline: "Warehouse and fleet talent that keeps freight actually moving.",
    color: "#01C2FB",
    image:
      "https://images.unsplash.com/photo-1740914994657-f1cdffdc418e?auto=format&fit=crop&w=1200&q=80",
    overlay: "route",
  },
  {
    title: "Oil & Gas",
    url: "/industries/oil-gas",
    tagline: "Certified crews for sites where a bad hire is a safety incident.",
    color: "#D50042",
    image:
      "https://images.unsplash.com/photo-1516199423456-1f1e91b06f25?auto=format&fit=crop&w=1200&q=80",
    overlay: "flare",
  },
  {
    title: "Agriculture",
    url: "/industries/agriculture",
    tagline: "Seasonal labor that shows up on the exact week you need it.",
    color: "#027A68",
    image:
      "https://images.unsplash.com/photo-1760635165251-5a3a81425a89?auto=format&fit=crop&w=1200&q=80",
    overlay: "grow",
  },
  {
    title: "Retail",
    url: "/industries/retail",
    tagline: "Floor and stockroom staff hired fast around seasonal peaks.",
    color: "#F8AF3C",
    image:
      "https://images.unsplash.com/photo-1760463921956-b21cfa5cb2ac?auto=format&fit=crop&w=1200&q=80",
    overlay: "tag",
  },
];

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function drawOverlay(ctx, w, h, t, kind, color) {
  const cy = h / 2;

  switch (kind) {
    case "heartbeat": {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const offset = (t * 60) % w;
      for (let x = 0; x < w; x++) {
        const px = (x + offset) % w;
        let y = cy;
        const local = ((x + offset) % 90) / 90;
        if (local > 0.4 && local < 0.5) y = cy - h * 0.35;
        else if (local >= 0.5 && local < 0.58) y = cy + h * 0.22;
        else if (local >= 0.58 && local < 0.64) y = cy - h * 0.08;
        x === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
      }
      ctx.stroke();
      break;
    }

    case "blueprint": {
      ctx.strokeStyle = hexToRgba(color, 0.35);
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      // small crane
      const armAngle = Math.sin(t * 0.7) * 0.15 - 0.1;
      const baseX = w * 0.15,
        baseY = h;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX, h * 0.15);
      ctx.lineTo(
        baseX + Math.cos(armAngle) * w * 0.3,
        h * 0.15 + Math.sin(armAngle) * h * 0.15,
      );
      ctx.stroke();
      break;
    }

    case "gear": {
      const cx = w * 0.5;
      const r = h * 0.28;
      const rot = t * 1.1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      for (let i = 0; i < 8; i++) {
        const a = rot + (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case "pulse": {
      ctx.strokeStyle = hexToRgba(color, 0.3);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w * 0.3, cy);
      ctx.lineTo(w * 0.4, cy - h * 0.25);
      ctx.lineTo(w * 0.55, cy + h * 0.25);
      ctx.lineTo(w * 0.65, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
      const prog = (t * 0.4) % 1;
      const px = prog * w;
      ctx.beginPath();
      ctx.arc(px, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      break;
    }

    case "steam": {
      for (let i = 0; i < 3; i++) {
        const phase = (t * 0.35 + i * 0.33) % 1;
        const x = w * 0.5 + Math.sin(t + i) * 6 + i * 10 - 10;
        const y = h - phase * h;
        ctx.strokeStyle = hexToRgba(color, (1 - phase) * 0.6);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + Math.sin(t * 2 + i) * 8, y - 10, x, y - 20);
        ctx.stroke();
      }
      break;
    }

    case "route": {
      ctx.strokeStyle = hexToRgba(color, 0.35);
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      const prog = (t * 0.3) % 1;
      ctx.beginPath();
      ctx.arc(prog * w, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      break;
    }

    case "flare": {
      for (let i = 0; i < 5; i++) {
        const phase = (t * 0.9 + i * 0.5) % 1;
        const x = w * 0.5 + Math.sin(i * 3) * 14;
        const y = h - phase * h * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, (1 - phase) * 4, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, (1 - phase) * 0.7);
        ctx.fill();
      }
      break;
    }

    case "grow": {
      const cycle = (t * 0.25) % 1;
      const stemH = cycle * h * 0.7;
      const x = w * 0.5;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x + Math.sin(t) * 4, h - stemH);
      ctx.stroke();
      if (cycle > 0.4) {
        [-1, 1].forEach((s) => {
          ctx.beginPath();
          ctx.ellipse(
            x + s * 8,
            h - stemH * 0.6,
            8,
            4,
            s * 0.6,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = hexToRgba(color, 0.6);
          ctx.fill();
        });
      }
      break;
    }

    case "tag": {
      const bounce = Math.abs(Math.sin(t * 1.4)) * h * 0.15;
      const x = w * 0.5,
        y = h * 0.55 - bounce;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x - 14, y);
      ctx.lineTo(x, y - 10);
      ctx.lineTo(x + 14, y);
      ctx.lineTo(x + 14, y + 12);
      ctx.lineTo(x - 14, y + 12);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y - 3, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFEF9";
      ctx.fill();
      break;
    }

    default:
      break;
  }
}

const OverlayCanvas = ({ kind, color }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
      drawOverlay(ctx, W, H, t, kind, color);
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [kind, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-x-0 bottom-0 h-16 w-full"
    />
  );
};

const Industries = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + (track.scrollWidth - window.innerWidth),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(".ind-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden font-arimo"
    >
      {/* <div className="absolute inset-0 bg-brand-crimson/80" />

      <svg className="absolute top-0 w-full" viewBox="0 0 1440 120">
        <path
          d="M0 0H1440V50C1100 120 800 10 500 60C300 100 150 80 0 30V0Z"
          fill="var(--color-primary-bg)"
        />
      </svg> */}
      <div className="flex h-screen flex-col justify-center">
        <div className="ind-header mb-8 translate-y-4 px-6 opacity-0 sm:px-8 lg:px-12">
          <span className="mb-3 inline-flex items-center gap-2.5 text-[12.5px] font-semibold tracking-[0.2em] text-black">
            <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#01C2FB,#2632E0)]" />
            WHERE WE WORK
          </span>
          <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.01em] text-black sm:text-[2.8rem]">
            Nine industries. One hiring standard.
          </h2>
        </div>

        <div className="relative flex-1">
          <div
            ref={trackRef}
            className="flex h-full items-center gap-6 px-6 will-change-transform sm:px-8 lg:px-12"
          >
            {INDUSTRIES.map((ind, i) => (
              <a
                key={ind.title}
                href={ind.url}
                className="group relative h-[62vh] w-[78vw] shrink-0 overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] sm:w-[55vw] lg:w-[38vw]"
              >
                <img
                  src={ind.image}
                  alt={ind.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span
                  className={`absolute inset-0`}
                  style={{
                    backgroundColor: hexToRgba(ind.color, 0.4),
                    mixBlendMode: "multiply",
                  }}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                <OverlayCanvas kind={ind.overlay} color={ind.color} />

                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="text-[12px] font-bold tracking-[0.15em] text-primary-bg/70">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(INDUSTRIES.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[1.5rem] font-bold text-primary-bg">
                    {ind.title}
                  </h3>
                  <p className="mt-1.5 max-w-[85%] text-[13.5px] leading-relaxed text-primary-bg/75">
                    {ind.tagline}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Industries;
