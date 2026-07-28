import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NODE_COLORS = ["#FFFEF9", "#FFD9E2", "#FFFFFF"];
const LINK_DIST = 120;

const FinalCTA = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, dpr, raf, nodes;

    class Node {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.14;
        this.vy = (Math.random() - 0.5) * 0.14;
        this.r = Math.random() * 1.3 + 0.9;
        this.color =
          NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
      }
      step() {
        const m = mouseRef.current;
        if (m.active) {
          const dx = m.x - this.x,
            dy = m.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160 && dist > 0.01) {
            const pull = (1 - dist / 160) * 0.018;
            this.vx += (dx / dist) * pull;
            this.vy += (dy / dist) * pull;
          }
        }
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -20) this.x = W + 20;
        if (this.x > W + 20) this.x = -20;
        if (this.y < -20) this.y = H + 20;
        if (this.y > H + 20) this.y = -20;
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(38 * (W / 1000));
      nodes = Array.from({ length: Math.max(20, count) }, () => new Node());
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => n.step());

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(255,254,249,${(1 - d / LINK_DIST) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      raf = requestAnimationFrame(draw);
    }

    function handleMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
    function handleLeave() {
      mouseRef.current.active = false;
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-card",
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        },
      );

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        defaults: { ease: "power3.out" },
      });
      tl.to(".cta-eyebrow", { opacity: 1, duration: 0.6 }, 0.2)
        .to(".cta-line span", { y: "0%", duration: 1, stagger: 0.1 }, "-=0.3")
        .to(".cta-sub", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
        .to(".cta-buttons", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to(".cta-trust", { opacity: 1, duration: 0.6 }, "-=0.3");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-primary-bg px-6 py-24 font-arimo sm:px-8 lg:px-12"
    >
      <div
        className="cta-card relative mx-auto max-w-5xl overflow-hidden rounded-tl-[10.5rem] rounded-br-[10.5rem] opacity-0 shadow-[0_40px_80px_-30px_rgba(213,0,66,0.45)]"
        style={{
          background: "linear-gradient(160deg, #D50042 0%, #97002e 100%)",
        }}
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-80"
        />

        <div className="relative z-10 mx-auto max-w-xl px-6 py-16 text-center sm:px-12 sm:py-20">
          <span className="cta-eyebrow mb-7 inline-flex items-center gap-2.5 text-[12.5px] font-bold tracking-[0.22em] text-white/70 opacity-0">
            <span className="h-[7px] w-[7px] rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.6)]" />
            READY WHEN YOU ARE
          </span>

          <h2 className="text-[2rem] font-bold leading-[1.12] tracking-[-0.01em] text-white sm:text-[2.6rem]">
            <div className="cta-line overflow-hidden">
              <span className="inline-block translate-y-[110%] will-change-transform">
                Your next hire is closer
              </span>
            </div>
            <div className="cta-line overflow-hidden">
              <span className="inline-block translate-y-[110%] text-white/70 will-change-transform">
                than you think.
              </span>
            </div>
          </h2>

          <p className="cta-sub mx-auto mt-6 max-w-md translate-y-4 text-[15.5px] leading-relaxed text-white/75 opacity-0">
            Tell us what you need staffed, and we'll have a shortlist moving
            within days — not months.
          </p>

          <div className="cta-buttons mt-9 flex translate-y-4 flex-wrap justify-center gap-4 opacity-0">
            <a
              href="/contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-tl-2xl rounded-br-2xl bg-primary-bg px-8 py-4 text-[14.5px] font-semibold text-brand-crimson transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
            >
              <span className="absolute inset-0 bg-[linear-gradient(120deg,#2632E0,#01C2FB,#027A68,#F8AF3C,#171B2E)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white">
                Start a Conversation <span aria-hidden>→</span>
              </span>
            </a>

            <a
              href="/jobs"
              className="inline-flex items-center rounded-tl-2xl rounded-br-2xl border-[1.5px] border-white/25 px-8 py-4 text-[14.5px] font-semibold text-white transition-all duration-500 hover:-translate-y-1 hover:border-white/50 hover:bg-white/10"
            >
              Browse Open Roles
            </a>
          </div>

          <p className="cta-trust mt-8 text-[12.5px] tracking-[0.04em] text-white/50 opacity-0">
            Usually replies within one business day.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
