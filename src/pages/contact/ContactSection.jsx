import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INK = "23,27,46";
const INDIGO = "#2632E0";

const QUICK_ACTIONS = [
  {
    label: "Quick call",
    color: "#01C2FB",
    icon: (
      <path d="M4 4c0 9 7 16 16 16l2-5-6-2-2 2c-3-1.5-5.5-4-7-7l2-2-2-6z" />
    ),
  },
  {
    label: "Live chat",
    color: "#2632E0",
    icon: <path d="M4 5h16v11H8l-4 4z" />,
  },
  {
    label: "Hiring brief",
    color: "#F8AF3C",
    icon: <path d="M6 3h9l5 5v13H6zM14 3v5h5M9 13h6M9 17h6" />,
  },
];

const MESSAGES = [
  {
    from: "in",
    text: "Hi — we need 15 warehouse staff for our Riga site, ASAP.",
    at: 0.6,
  },
  {
    from: "out",
    text: "On it. Sending 6 pre-screened candidates by end of day.",
    at: 3.2,
    typingBefore: 1.5,
  },
  {
    from: "in",
    text: "Perfect — can you also handle the visa paperwork?",
    at: 5.7,
  },
  {
    from: "out",
    text: "Already moving in parallel. You'll have it before they land.",
    at: 8.3,
    typingBefore: 1.5,
  },
];

const CYCLE = 13;
const FADE_START = 11.2;
const FADE_END = 12.3;

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

const ChatCanvas = () => {
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

    function drawTypingDots(x, y, phase) {
      for (let i = 0; i < 3; i++) {
        const b = Math.max(0, Math.sin(phase * 6 - i * 0.6)) * 3;
        ctx.beginPath();
        ctx.arc(x + i * 9, y - b, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${INK},0.4)`;
        ctx.fill();
      }
    }

    function draw(now) {
      const t = (now - start) / 1000;
      const cycleT = t % CYCLE;

      ctx.clearRect(0, 0, W, H);

      const pad = 14;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(pad, pad, W - pad * 2, H - pad * 2, 26)
        : ctx.rect(pad, pad, W - pad * 2, H - pad * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.clip();

      ctx.fillStyle = INDIGO;
      ctx.fillRect(pad, pad, W - pad * 2, 56);
      ctx.beginPath();
      ctx.arc(pad + 30, pad + 28, 13, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.fillStyle = INDIGO;
      ctx.font = "700 12px Arimo, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("TM", pad + 30, pad + 32);

      ctx.textAlign = "left";
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 13.5px Arimo, sans-serif";
      ctx.fillText("Talent Meet Support", pad + 52, pad + 24);
      ctx.beginPath();
      ctx.arc(pad + 55, pad + 34, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#50A153";
      ctx.fill();
      ctx.font = "400 11px Arimo, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText("Online now", pad + 64, pad + 37);

      let fade = 1;
      if (cycleT > FADE_START) {
        fade = Math.max(0, 1 - (cycleT - FADE_START) / (FADE_END - FADE_START));
      }

      const bubbleMaxW = (W - pad * 2) * 0.68;
      let cursorY = pad + 78;

      MESSAGES.forEach((msg) => {
        if (cycleT < msg.at) return;
        const localT = Math.min(1, (cycleT - msg.at) / 0.35);
        const ease = 1 - Math.pow(1 - localT, 3);
        const alpha = ease * fade;

        ctx.font = "400 13px Arimo, sans-serif";
        const lines = wrapText(ctx, msg.text, bubbleMaxW - 28);
        const bh = lines.length * 17 + 22;
        const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 28;

        const bx = msg.from === "in" ? pad + 14 : W - pad - 14 - bw;
        const by = cursorY + (1 - ease) * 10;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(bx, by, bw, bh, 14)
          : ctx.rect(bx, by, bw, bh);
        ctx.fillStyle = msg.from === "in" ? `rgba(${INK},0.06)` : INDIGO;
        ctx.fill();

        ctx.fillStyle = msg.from === "in" ? `rgb(${INK})` : "#ffffff";
        ctx.textAlign = "left";
        lines.forEach((line, li) => {
          ctx.fillText(line, bx + 14, by + 22 + li * 17);
        });

        if (msg.from === "out" && localT >= 1) {
          const readAt = 0.6;
          const readProgress = Math.min(
            1,
            Math.max(0, (cycleT - msg.at - readAt) / 0.3),
          );
          ctx.strokeStyle =
            readProgress > 0.5 ? "#01C2FB" : "rgba(255,255,255,0.6)";
          ctx.lineWidth = 1.6;
          const tickX = bx + bw - 16,
            tickY = by + bh - 8;
          ctx.beginPath();
          ctx.moveTo(tickX - 6, tickY - 2);
          ctx.lineTo(tickX - 3, tickY + 1);
          ctx.lineTo(tickX + 3, tickY - 5);
          ctx.stroke();
        }

        ctx.restore();
        cursorY = by + bh + 14;
      });

      MESSAGES.forEach((msg) => {
        if (!msg.typingBefore) return;
        const typingStart = msg.at - msg.typingBefore;
        if (cycleT >= typingStart && cycleT < msg.at) {
          ctx.save();
          ctx.globalAlpha = fade;
          const tw = 52,
            th = 26;
          const tx = W - pad - 14 - tw;
          const ty = cursorY;
          ctx.beginPath();
          ctx.roundRect
            ? ctx.roundRect(tx, ty, tw, th, 13)
            : ctx.rect(tx, ty, tw, th);
          ctx.fillStyle = `rgba(${INK},0.06)`;
          ctx.fill();
          drawTypingDots(tx + 14, ty + 16, t * 3);
          ctx.restore();
        }
      });

      ctx.restore();

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};

const ContactSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".ch-eyebrow", { opacity: 1, y: 0, duration: 0.6 })
        .to(".ch-line span", { y: "0%", duration: 0.9, stagger: 0.08 }, "-=0.3")
        .to(".ch-sub", { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .to(".ch-actions", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .to(".ch-buttons", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .to(".ch-phone", { opacity: 1, scale: 1, duration: 0.9 }, "-=0.6");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-primary-bg px-6 py-24 font-arimo sm:px-8 lg:px-12"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="ch-eyebrow mb-5 inline-flex translate-y-3 items-center gap-2.5 text-[12.5px] font-semibold tracking-[0.2em] text-ink-light opacity-0">
            <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
            TALK TO OUR TEAM
          </span>

          <h1 className="text-[2.8rem] font-semibold leading-[1.12] tracking-[-0.02em] text-black sm:text-[3rem]">
            <div className="ch-line overflow-hidden">
              <span className="inline-block translate-y-[110%] will-change-transform">
                Real people answer.
              </span>
            </div>
            <div className="ch-line overflow-hidden">
              <span className="inline-block translate-y-[110%] text-brand-crimson will-change-transform">
                Usually within minutes.
              </span>
            </div>
          </h1>

          <p className="ch-sub mt-6 max-w-md translate-y-4 text-[16px] leading-relaxed text-black/80 opacity-0">
            Call, message, or send us a hiring brief — whichever's fastest for
            you. Someone on the team is already reading it before you've
            finished typing.
          </p>

          <div className="ch-actions mt-8 grid max-w-md translate-y-4 grid-cols-3 gap-3 opacity-0">
            {QUICK_ACTIONS.map((a) => (
              <div
                key={a.label}
                className="rounded-2xl border border-ink/8 bg-white px-3 py-4 text-center shadow-[0_10px_24px_-16px_rgba(23,27,46,0.2)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={a.color}
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-2 h-5 w-5"
                >
                  {a.icon}
                </svg>
                <p className="text-[12px] font-semibold text-ink">{a.label}</p>
              </div>
            ))}
          </div>

          <div className="ch-buttons mt-8 flex translate-y-4 flex-wrap gap-4 opacity-0">
            <a
              href="#contact-form"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-tl-2xl rounded-br-2xl bg-ink px-8 py-4 text-[14.5px] font-semibold text-primary-bg transition-transform duration-500 hover:-translate-y-1"
            >
              <span className="absolute inset-0 bg-[linear-gradient(120deg,#2632E0,#01C2FB,#027A68,#F8AF3C,#D50042)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative z-10">Send Inquiry →</span>
            </a>
            <a
              href="mailto:hello@talentmeet.com"
              className="inline-flex items-center rounded-tl-2xl rounded-br-2xl border-[1.5px] border-ink/15 px-8 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:-translate-y-1 hover:border-ink/35 hover:bg-ink/[0.03]"
            >
              Email Us
            </a>
          </div>
        </div>

        <div className="ch-phone relative h-[440px] w-full scale-95 opacity-0 sm:h-[500px] lg:h-[560px]">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(70%_60%_at_50%_30%,rgba(38,50,224,0.1),transparent_70%)]" />
          <ChatCanvas />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
