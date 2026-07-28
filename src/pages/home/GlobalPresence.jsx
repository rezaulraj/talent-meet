import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INK = "23,27,46"; // matches --color-ink, as an rgb triplet for canvas alpha work

const HQ = { name: "Dhaka (HQ)", lat: 23.81, lon: 90.41 };

const DESTINATIONS = [
  {
    name: "Cyprus",
    lat: 51.51,
    lon: -0.13,
    stat: "550+ placed",
    color: "#2632E0",
  },
  {
    name: "Croatia",
    lat: 45.1,
    lon: 15.2,
    stat: "620+ placed",
    color: "#01C2FB",
  },
  {
    name: "Romania",
    lat: 45.94,
    lon: 24.97,
    stat: "890+ placed",
    color: "#027A68",
  },
  {
    name: "Slovenia",
    lat: 46.15,
    lon: 14.99,
    stat: "310+ placed",
    color: "#F8AF3C",
  },
  {
    name: "Latvia",
    lat: 56.88,
    lon: 24.6,
    stat: "270+ placed",
    color: "#D50042",
  },
  {
    name: "Serbia",
    lat: 44.02,
    lon: 21.0,
    stat: "540+ placed",
    color: "#50A153",
  },
];

const DEG = Math.PI / 180;

function project(lat, lon, thetaOffset, R, cx, cy) {
  const lambda = lon * DEG + thetaOffset;
  const phi = lat * DEG;
  const x3 = R * Math.cos(phi) * Math.sin(lambda);
  const y3 = R * Math.sin(phi);
  const z3 = R * Math.cos(phi) * Math.cos(lambda);
  return { x: cx + x3, y: cy - y3, z: z3 };
}

function slerpArcPoints(a, b, altitude, steps) {
  const toVec = (p) => {
    const lat = p.lat * DEG,
      lon = p.lon * DEG;
    return [
      Math.cos(lat) * Math.sin(lon),
      Math.sin(lat),
      Math.cos(lat) * Math.cos(lon),
    ];
  };
  const va = toVec(a),
    vb = toVec(b);
  const dot = va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2];
  const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let v;
    if (omega < 1e-4) {
      v = va;
    } else {
      const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
      const s2 = Math.sin(t * omega) / Math.sin(omega);
      v = [
        va[0] * s1 + vb[0] * s2,
        va[1] * s1 + vb[1] * s2,
        va[2] * s1 + vb[2] * s2,
      ];
    }
    const lift = 1 + altitude * Math.sin(t * Math.PI);
    pts.push([v[0] * lift, v[1] * lift, v[2] * lift]);
  }
  return pts;
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

const GlobalPresence = () => {
  const sectionRef = useRef(null);
  const globeWrapRef = useRef(null);
  const canvasRef = useRef(null);
  const hoveredRef = useRef(null);
  const legendRefs = useRef([]);
  const scrollProgressRef = useRef(0); // 0 -> 1 as the section scrolls through view

  const setHovered = (name) => {
    hoveredRef.current = name;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        globeWrapRef.current,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );

      gsap.to(".gp-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 55%",
        scrub: 0.7,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, dpr, raf;
    const start = performance.now();
    const n = DESTINATIONS.length;

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
      const cx = W / 2,
        cy = H / 2;
      const R = Math.min(W, H) * 0.36;
      const theta = t * 0.12;
      const scrollP = scrollProgressRef.current;

      ctx.clearRect(0, 0, W, H);

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${INK},0.14)`;
      ctx.stroke();

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = 0; lon <= 360; lon += 6) {
          const p = project(lat, lon, theta, R, cx, cy);
          if (p.z <= 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = `rgba(${INK},0.1)`;
        ctx.stroke();
      }

      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 6) {
          const p = project(lat, lon, theta, R, cx, cy);
          if (p.z <= 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = `rgba(${INK},0.1)`;
        ctx.stroke();
      }

      const hq = project(HQ.lat, HQ.lon, theta, R, cx, cy);
      const hqAlpha = Math.max(0.2, hq.z / R);
      ctx.beginPath();
      ctx.arc(hq.x, hq.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${INK},${hqAlpha})`;
      ctx.fill();
      const hqPulse = (t * 0.6) % 1;
      ctx.beginPath();
      ctx.arc(hq.x, hq.y, 4 + hqPulse * 14, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${INK},${(1 - hqPulse) * 0.3})`;
      ctx.stroke();

      const hoveredName = hoveredRef.current;

      DESTINATIONS.forEach((d, i) => {
        const fraction = clamp01(scrollP * n - i);
        const isHovered = hoveredName === d.name;

        if (fraction > 0) {
          const arcPts = slerpArcPoints(HQ, d, 0.22, 40);
          ctx.beginPath();
          let started = false;
          const drawCount = Math.max(2, Math.round(arcPts.length * fraction));
          arcPts.slice(0, drawCount).forEach(([x3, y3, z3]) => {
            const rx = x3 * Math.cos(theta) + z3 * Math.sin(theta);
            const rz = -x3 * Math.sin(theta) + z3 * Math.cos(theta);
            const sx = cx + rx * R;
            const sy = cy - y3 * R;
            if (rz < -0.05) {
              started = false;
              return;
            }
            if (!started) {
              ctx.moveTo(sx, sy);
              started = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          });
          const lineAlpha = isHovered ? 1 : 0.6 * fraction + 0.15;
          ctx.strokeStyle = `${d.color}${Math.round(lineAlpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.lineWidth = isHovered ? 2.2 : 1.4;
          ctx.stroke();
        }

        const p = project(d.lat, d.lon, theta, R, cx, cy);
        const depthAlpha = Math.max(0.12, p.z / R);

        if (fraction > 0.02) {
          const pulse = (t * 0.7 + i * 0.3) % 1.4;
          if (pulse < 1) {
            ctx.beginPath();
            ctx.arc(
              p.x,
              p.y,
              4 + pulse * (isHovered ? 20 : 12),
              0,
              Math.PI * 2,
            );
            const ringAlphaHex = Math.round((1 - pulse) * 60 * fraction)
              .toString(16)
              .padStart(2, "0");
            ctx.strokeStyle = `${d.color}${ringAlphaHex}`;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, isHovered ? 6 : 4.5, 0, Math.PI * 2);
          ctx.fillStyle = d.color;
          ctx.globalAlpha =
            depthAlpha * fraction + (1 - fraction) * depthAlpha * 0.2;
          ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${INK},${depthAlpha * 0.2})`;
          ctx.fill();
        }

        const row = legendRefs.current[i];
        if (row) {
          row.style.opacity = 0.4 + 0.6 * fraction;
          row.style.backgroundColor = `rgba(${INK},${0.04 * fraction})`;
          row.style.borderColor = `rgba(${INK},${0.1 * fraction + 0.03})`;
        }
      });

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

  return (
    <section
      ref={sectionRef}
      className="bg-primary-bg px-6 py-24 font-arimo sm:px-8 lg:px-12"
    >
      <div className="gp-header mx-auto max-w-3xl translate-y-4 text-center opacity-0">
        <span className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-bold tracking-[0.2em] text-ink-light">
          <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#01C2FB,#2632E0)]" />
          GLOBAL PRESENCE
        </span>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.01em] text-black sm:text-[2.8rem]">
          One home base. Six countries, and counting.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-ink-light">
          Every route on this globe is a real corridor we place candidates
          through — scroll to watch each one connect.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div
          ref={globeWrapRef}
          className="relative h-[420px] opacity-0 sm:h-[520px]"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {DESTINATIONS.map((d, i) => (
            <div
              key={d.name}
              ref={(el) => (legendRefs.current[i] = el)}
              onMouseEnter={() => setHovered(d.name)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center justify-between gap-3 rounded-2xl border border-ink/5 px-4 py-3 opacity-40 transition-shadow duration-300"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-[14.5px] font-semibold text-ink">
                  {d.name}
                </span>
              </div>
              <span className="text-[12.5px] text-ink-light">{d.stat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;
