import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BLACK = "#000000";
const RED = "#D50042";
const BRAND = "Talent Grid";

const PENTAGON_CLIP = "polygon(16% 0%, 100% 0%, 100% 100%, 16% 100%, 0% 50%)";

const HEXAGON_CLIP =
  "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)";

const HERO_RAIL_STEPS = ["Request", "Match", "Deploy", "Grow"];
const HERO_RAIL_W = 56;

const SOLUTIONS = [
  {
    tag: "Volume",
    title: "Bulk Hiring",
    desc: "Hundreds of roles filled on a fixed schedule, without cutting corners on screening or compliance.",
    img: "https://images.unsplash.com/photo-1741591647611-765ae3019a0f",
  },
  {
    tag: "Leadership",
    title: "Executive Search",
    desc: "Confidential search for leadership and specialist roles, where the right hire changes the business.",
    img: "https://images.unsplash.com/photo-1758518731694-41ea7fa6a2d9",
  },
  {
    tag: "RPO",
    title: "Recruitment Process Outsourcing",
    desc: "We run your hiring function end to end so your internal team can focus on the work, not the workload.",
    img: "https://images.unsplash.com/photo-1748609160056-7b95f30041f0",
  },
  {
    tag: "Flexible",
    title: "Temporary Staffing",
    desc: "Flexible crews ready for seasonal peaks and project surges, scaled up or down without permanent overhead.",
    img: "https://images.unsplash.com/photo-1751054720514-067105f538d4",
  },
];

const PROCESS = [
  {
    title: "Submit Requirements",
    desc: "Tell us the roles, headcount, and timeline through one form — no back-and-forth to get started.",
  },
  {
    title: "Shortlist Delivered",
    desc: "Screened, tested candidates land in your inbox — not a stack of unfiltered resumes to sort through.",
  },
  {
    title: "Interviews Arranged",
    desc: "We coordinate scheduling across time zones so you just show up and talk to people.",
  },
  {
    title: "Offer & Compliance",
    desc: "Contracts, visas, and work permits handled in the background the moment you say yes.",
  },
  {
    title: "Onboarding Support",
    desc: "We stay on the case through the first pay cycle — not just until the signature.",
  },
];

const WHY_US = [
  "One accountable team, not four disconnected vendors",
  "98% visa approval rate across every market we operate in",
  "Local teams in 40+ countries, not just contacts on a spreadsheet",
  "Trade-tested candidates, not just interviewed ones",
  "Payroll and statutory compliance included, not billed separately",
  "Support continues past the placement fee, through the first pay cycle",
];

const EMPLOYMENT_TYPES = [
  "Permanent",
  "Temporary",
  "Executive Search",
  "Bulk / RPO",
];

const Employers = () => {
  const rootRef = useRef(null);
  const processCanvasRef = useRef(null);
  const processListRef = useRef(null);
  const stepRefs = useRef([]);
  const heroRailCanvasRef = useRef(null);
  const heroRailWrapRef = useRef(null);

  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    roles: "",
    positions: "",
    type: EMPLOYMENT_TYPES[0],
    country: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const heroCanvas = heroRailCanvasRef.current;
    const heroCtx = heroCanvas.getContext("2d");
    const heroDpr = Math.max(1, window.devicePixelRatio || 1);
    let heroPathPoints = [];
    let heroRailH = 0;
    let heroNodes = [];

    function heroEase(t) {
      return 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
    }
    function heroXAt(y) {
      if (heroNodes.length === 0) return HERO_RAIL_W / 2;
      if (y <= heroNodes[0].y) return heroNodes[0].x;
      for (let i = 0; i < heroNodes.length - 1; i++) {
        const a = heroNodes[i];
        const b = heroNodes[i + 1];
        if (y >= a.y && y <= b.y) {
          const t = (y - a.y) / Math.max(1, b.y - a.y);
          return a.x + (b.x - a.x) * heroEase(t);
        }
      }
      return heroNodes[heroNodes.length - 1].x;
    }
    function measureHeroRail() {
      if (!heroRailWrapRef.current) return;
      heroRailH = heroRailWrapRef.current.offsetHeight;
      heroCanvas.width = HERO_RAIL_W * heroDpr;
      heroCanvas.height = heroRailH * heroDpr;
      heroCanvas.style.width = `${HERO_RAIL_W}px`;
      heroCanvas.style.height = `${heroRailH}px`;
      heroCtx.setTransform(heroDpr, 0, 0, heroDpr, 0, 0);

      const n = HERO_RAIL_STEPS.length;
      const leftX = HERO_RAIL_W * 0.35;
      const rightX = HERO_RAIL_W * 0.65;
      heroNodes = HERO_RAIL_STEPS.map((label, i) => ({
        label,
        x: i % 2 === 0 ? leftX : rightX,
        y: (i / (n - 1)) * heroRailH,
      }));

      const points = [];
      for (let y = 0; y <= heroRailH; y += 4) points.push({ x: heroXAt(y), y });
      heroPathPoints = points;
    }
    function drawHeroRail(reveal) {
      const revealY = reveal * heroRailH;
      heroCtx.clearRect(0, 0, HERO_RAIL_W, heroRailH);

      const visible = heroPathPoints.filter((p) => p.y <= revealY);
      if (visible.length > 1) {
        heroCtx.strokeStyle = RED;
        heroCtx.lineWidth = 2.5;
        heroCtx.lineJoin = "round";
        heroCtx.lineCap = "round";
        heroCtx.beginPath();
        visible.forEach((p, i) =>
          i === 0 ? heroCtx.moveTo(p.x, p.y) : heroCtx.lineTo(p.x, p.y),
        );
        heroCtx.stroke();
      }

      heroNodes.forEach((node) => {
        const shown = node.y <= revealY + 2;
        if (!shown) return;
        heroCtx.save();
        heroCtx.shadowColor = "rgba(213,0,66,0.6)";
        heroCtx.shadowBlur = 8;
        heroCtx.beginPath();
        heroCtx.arc(node.x, node.y, 5.5, 0, Math.PI * 2);
        heroCtx.fillStyle = RED;
        heroCtx.fill();
        heroCtx.restore();
      });
    }
    measureHeroRail();
    drawHeroRail(0);
    const onHeroResize = () => {
      measureHeroRail();
      drawHeroRail(1);
    };
    window.addEventListener("resize", onHeroResize);

    const canvas = processCanvasRef.current;
    const ctx2d = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const RAIL_W = 64;
    let pathPoints = [];
    let railH = 0;
    let nodes = [];

    function ease(t) {
      return 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
    }
    function xAt(y) {
      if (nodes.length === 0) return RAIL_W / 2;
      if (y <= nodes[0].y) return nodes[0].x;
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i];
        const b = nodes[i + 1];
        if (y >= a.y && y <= b.y) {
          const t = (y - a.y) / Math.max(1, b.y - a.y);
          return a.x + (b.x - a.x) * ease(t);
        }
      }
      return nodes[nodes.length - 1].x;
    }
    function measure() {
      if (!processListRef.current) return;
      railH = processListRef.current.offsetHeight;
      canvas.width = RAIL_W * dpr;
      canvas.height = railH * dpr;
      canvas.style.width = `${RAIL_W}px`;
      canvas.style.height = `${railH}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

      const leftX = RAIL_W * 0.32;
      const rightX = RAIL_W * 0.68;
      nodes = stepRefs.current.map((el, i) => ({
        x: i % 2 === 0 ? leftX : rightX,
        y: el ? el.offsetTop + el.offsetHeight / 2 : 0,
      }));

      const points = [];
      for (let y = 0; y <= railH; y += 4) points.push({ x: xAt(y), y });
      pathPoints = points;
    }
    function pointAtY(y) {
      if (pathPoints.length === 0) return { x: RAIL_W / 2, y: 0 };
      let closest = pathPoints[0];
      for (const p of pathPoints) {
        if (p.y > y) break;
        closest = p;
      }
      return closest;
    }
    function draw(progress) {
      const progressY = progress * railH;
      ctx2d.clearRect(0, 0, RAIL_W, railH);

      ctx2d.strokeStyle = "rgba(0,0,0,0.14)";
      ctx2d.lineWidth = 2;
      ctx2d.lineJoin = "round";
      ctx2d.lineCap = "round";
      ctx2d.beginPath();
      pathPoints.forEach((p, i) =>
        i === 0 ? ctx2d.moveTo(p.x, p.y) : ctx2d.lineTo(p.x, p.y),
      );
      ctx2d.stroke();

      const filled = pathPoints.filter((p) => p.y <= progressY);
      if (filled.length > 1) {
        ctx2d.strokeStyle = RED;
        ctx2d.lineWidth = 2.5;
        ctx2d.beginPath();
        filled.forEach((p, i) =>
          i === 0 ? ctx2d.moveTo(p.x, p.y) : ctx2d.lineTo(p.x, p.y),
        );
        ctx2d.stroke();
      }

      nodes.forEach((node, i) => {
        const passed = node.y <= progressY;
        ctx2d.beginPath();
        ctx2d.arc(node.x, node.y, 7, 0, Math.PI * 2);
        ctx2d.fillStyle = passed ? RED : "#ffffff";
        ctx2d.fill();
        ctx2d.lineWidth = 2;
        ctx2d.strokeStyle = passed ? RED : "rgba(0,0,0,0.35)";
        ctx2d.stroke();
        ctx2d.fillStyle = passed ? "#ffffff" : "rgba(0,0,0,0.55)";
        ctx2d.font = "600 9px Arimo, sans-serif";
        ctx2d.textAlign = "center";
        ctx2d.textBaseline = "middle";
        ctx2d.fillText(String(i + 1), node.x, node.y + 0.5);
      });

      const head = pointAtY(progressY);
      if (progressY > 2 && progressY < railH - 2) {
        ctx2d.save();
        ctx2d.shadowColor = "rgba(213,0,66,0.7)";
        ctx2d.shadowBlur = 10;
        ctx2d.beginPath();
        ctx2d.arc(head.x, head.y, 5, 0, Math.PI * 2);
        ctx2d.fillStyle = RED;
        ctx2d.fill();
        ctx2d.restore();
      }
    }

    measure();
    draw(0);
    const onResize = () => {
      measure();
      draw(0);
    };
    window.addEventListener("resize", onResize);

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            ".hero-eyebrow",
            ".hero-line",
            ".hero-sub",
            ".hero-cta",
            ".hero-image",
            ".hero-badge",
            ".quick-card",
            ".reveal-up",
            ".process-step",
          ],
          { opacity: 1, clearProps: "all" },
        );
        draw(1);
        drawHeroRail(1);
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });
      const heroRailProxy = { v: 0 };
      tl.from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.5 })
        .from(
          ".hero-line",
          { y: "100%", opacity: 0, duration: 0.85, stagger: 0.09 },
          "-=0.2",
        )
        .from(".hero-sub", { y: 14, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(
          ".hero-cta",
          { y: 10, opacity: 0, duration: 0.5, stagger: 0.08 },
          "-=0.35",
        )
        .to(
          heroRailProxy,
          {
            v: 1,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => drawHeroRail(heroRailProxy.v),
          },
          "-=0.7",
        )
        .from(
          ".hero-image",
          { opacity: 0, scale: 0.94, duration: 0.9 },
          "-=0.9",
        )
        .from(
          ".hero-badge",
          { y: 16, opacity: 0, duration: 0.5, ease: "back.out(1.8)" },
          "-=0.4",
        )
        .from(".quick-card", { y: 40, opacity: 0, duration: 0.7 }, "-=0.4");

      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      gsap.utils.toArray(".process-step").forEach((el, i) => {
        gsap.from(el, {
          x: i % 2 === 0 ? -24 : 24,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      ScrollTrigger.create({
        trigger: processListRef.current,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.4,
        onUpdate: (self) => draw(self.progress),
      });
    }, rootRef);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", onHeroResize);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="bg-[#FFFEF9] font-arimo text-black">
      <div className="absolute left-6 top-6 z-30 flex items-center gap-2.5 sm:left-10 sm:top-8">
        <span
          className="block h-5 w-5"
          style={{ backgroundColor: RED, clipPath: PENTAGON_CLIP }}
          aria-hidden="true"
        />
        <span className="text-[15px] font-bold uppercase tracking-[0.08em] text-black">
          {BRAND}
        </span>
      </div>

      <section className="relative overflow-hidden bg-[#FFFEF9] pb-32 pt-10">
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:px-10 lg:grid-cols-[56px_1fr_1fr] lg:items-center lg:gap-14 lg:px-16">

          <div ref={heroRailWrapRef} className="hidden h-[300px] lg:block">
          </div>

          <div>
            <div className="hero-eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-black/70">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: RED }}
              />
              Employers · A Partnership Perspective
            </div>

            <h1 className="max-w-lg text-[36px] font-bold leading-[1.12] text-black sm:text-[46px] lg:text-[50px]">
              <span className="block overflow-hidden">
                <span className="hero-line block">We don't work</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block">
                  <span style={{ color: RED }}>for</span> you. We work
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block">alongside you.</span>
              </span>
            </h1>

            <p className="hero-sub mt-6 max-w-md text-[15.5px] leading-relaxed text-black/60">
              A vendor fills the role and disappears. A partner stays close
              enough to know when your headcount plan changes. From a single
              specialist hire to a thousand-person deployment, Talent Grid
              sources, screens, and delivers workforce as an extension of your
              own team — not a transaction you revisit every time you're
              short-staffed.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#request"
                className="hero-cta rounded-full px-7 py-3.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: RED }}
              >
                Request employees
              </a>
              <a
                href="#solutions"
                className="hero-cta rounded-full border border-black/20 px-7 py-3.5 text-sm font-bold text-black transition-colors duration-300 hover:bg-black hover:text-white"
              >
                Employer solutions
              </a>
            </div>
          </div>

          <div className="relative">
            <div
              className="hero-image relative aspect-square w-full overflow-hidden sm:aspect-[4/3.4]"
              style={{ clipPath: HEXAGON_CLIP }}
            >
              <img
                src="https://images.unsplash.com/photo-1759310610325-2c7cb621e5e3?auto=format&fit=crop&w=1200&q=80"
                alt="Two employers shaking hands on a partnership"
                className="h-full w-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            <div
              className="hero-badge absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 text-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.4)] sm:left-4 sm:translate-x-0"
              style={{ backgroundColor: BLACK }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                500+ employer partners
              </span>
            </div>

            <div className="quick-card relative z-10 -mt-10 w-[92%] max-w-sm rounded-2xl border border-black/10 bg-[#FFFEF9] p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] sm:ml-auto sm:mr-4">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{ color: RED }}
              >
                Quick request
              </p>
              <h3 className="mt-1 text-[16px] font-bold text-black">
                Get a shortlist started today
              </h3>
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("request")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <input
                  type="text"
                  placeholder="Company name"
                  className="w-full rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Work email"
                  className="w-full rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg py-2.5 text-[14px] font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: BLACK }}
                >
                  Continue to full request →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="reveal-up relative aspect-[4/3] overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1635350736475-c8cef4b21906?auto=format&fit=crop&w=1000&q=80"
              alt="A hiring sign in a shop window"
              className="h-full w-full object-cover grayscale"
            />
          </div>
          <div className="reveal-up">
            <span
              className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: RED }}
            >
              <span
                className="h-[7px] w-[7px] rounded-full"
                style={{ backgroundColor: RED }}
              />
              Hire Talent
            </span>
            <h2 className="text-[28px] font-bold leading-tight text-black sm:text-[34px]">
              Open roles cost you more the longer they stay open.
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-black/65">
              Every week a seat sits empty is a week your team absorbs the gap.
              We keep a live pipeline across the roles you hire for most, so
              when a request comes in, we're not starting from a blank search —
              we're starting from a shortlist.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Pre-screened candidates matched to your role, not just your keyword",
                "Local and overseas sourcing running in parallel",
                "One request form covers sourcing, screening, and paperwork",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[14.5px] text-black/70"
                >
                  <span
                    className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: RED }}
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M2.5 6.5l2.2 2.2L9.5 3.5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="solutions"
        className="bg-black px-6 py-24 text-white sm:px-10 sm:py-28"
      >
        <div className="reveal-up mx-auto mb-14 max-w-2xl text-center">
          <span
            className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.2em]"
            style={{ color: RED }}
          >
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: RED }}
            />
            Employer Solutions
          </span>
          <h2 className="text-[30px] font-bold leading-tight text-white sm:text-[38px]">
            Whatever the hiring problem, there's a solution for it here.
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2">
          {SOLUTIONS.map((s) => (
            <div
              key={s.title}
              className="reveal-up group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-white/25"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={`${s.img}?auto=format&fit=crop&w=900&q=80`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: RED }}
                >
                  {s.tag}
                </span>
                <h3 className="mt-1 text-[19px] font-bold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24 sm:px-10 sm:py-28">
        <div className="reveal-up mx-auto mb-14 max-w-2xl text-center">
          <span
            className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.2em]"
            style={{ color: RED }}
          >
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: RED }}
            />
            Recruitment Process
          </span>
          <h2 className="text-[30px] font-bold leading-tight text-black sm:text-[38px]">
            Five steps from request to first day.
          </h2>
        </div>

        <div className="relative flex gap-6 sm:gap-10">
          <div className="hidden shrink-0 sm:block" style={{ width: 64 }}>
            <canvas ref={processCanvasRef} className="block" />
          </div>

          <div ref={processListRef} className="flex-1 space-y-10">
            {PROCESS.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => (stepRefs.current[i] = el)}
                className="process-step flex items-start gap-4"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white sm:hidden"
                  style={{ backgroundColor: RED }}
                >
                  {i + 1}
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/40">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-[19px] font-bold text-black">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-lg text-[14.5px] leading-relaxed text-black/60">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="request"
        className="relative overflow-hidden bg-black px-6 py-24 text-white sm:px-10 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 opacity-[0.05]"
          style={{ backgroundColor: RED, clipPath: PENTAGON_CLIP }}
        />

        <div className="reveal-up relative mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <span
              className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.2em]"
              style={{ color: RED }}
            >
              <span
                className="h-[7px] w-[7px] rounded-full"
                style={{ backgroundColor: RED }}
              />
              Request Employees
            </span>
            <h2 className="text-[30px] font-bold leading-tight text-white sm:text-[38px]">
              Tell us the role. We'll bring the shortlist.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/60">
              Fill in as much as you have — even a rough headcount and timeline
              is enough to get sourcing started. A member of our team replies
              within one business day with next steps.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "No obligation, no placement fee to submit a request",
                "Replies within one business day",
                "One team handles sourcing through onboarding",
              ].map((line) => (
                <div
                  key={line}
                  className="flex items-start gap-3 text-[14px] text-white/70"
                >
                  <span
                    className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: RED }}
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M2.5 6.5l2.2 2.2L9.5 3.5" />
                    </svg>
                  </span>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#FFFEF9] p-7 text-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:p-9">
            {submitted ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <span
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(213,0,66,0.1)" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke={RED}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="text-[19px] font-bold text-black">
                  Request received.
                </h3>
                <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-black/60">
                  Someone from Talent Grid will reach out within one business
                  day at the email you gave us.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-[13px] font-bold underline decoration-2 underline-offset-4"
                  style={{ color: RED }}
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Company name" required>
                    <input
                      required
                      value={form.company}
                      onChange={updateField("company")}
                      className="form-input"
                      placeholder="Acme Manufacturing"
                    />
                  </Field>
                  <Field label="Contact person" required>
                    <input
                      required
                      value={form.contact}
                      onChange={updateField("contact")}
                      className="form-input"
                      placeholder="Full name"
                    />
                  </Field>
                  <Field label="Work email" required>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={updateField("email")}
                      className="form-input"
                      placeholder="you@company.com"
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      value={form.phone}
                      onChange={updateField("phone")}
                      className="form-input"
                      placeholder="+880 1XX XXX XXXX"
                    />
                  </Field>
                  <Field label="Roles needed" required>
                    <input
                      required
                      value={form.roles}
                      onChange={updateField("roles")}
                      className="form-input"
                      placeholder="e.g. Welders, Warehouse staff"
                    />
                  </Field>
                  <Field label="Number of positions">
                    <input
                      value={form.positions}
                      onChange={updateField("positions")}
                      className="form-input"
                      placeholder="e.g. 25"
                    />
                  </Field>
                  <Field label="Employment type">
                    <select
                      value={form.type}
                      onChange={updateField("type")}
                      className="form-input"
                    >
                      {EMPLOYMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Country / location">
                    <input
                      value={form.country}
                      onChange={updateField("country")}
                      className="form-input"
                      placeholder="e.g. Saudi Arabia"
                    />
                  </Field>
                </div>

                <Field label="Anything else we should know">
                  <textarea
                    value={form.message}
                    onChange={updateField("message")}
                    rows={4}
                    className="form-input resize-none"
                    placeholder="Timeline, budget, specific certifications required…"
                  />
                </Field>

                <button
                  type="submit"
                  className="w-full rounded-full py-4 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: RED }}
                >
                  Request Employees
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28">
        <div className="reveal-up mx-auto mb-14 max-w-2xl text-center">
          <span
            className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.2em]"
            style={{ color: RED }}
          >
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: RED }}
            />
            Why Choose Us
          </span>
          <h2 className="text-[30px] font-bold leading-tight text-black sm:text-[38px]">
            Employers switch to us for six reasons, usually.
          </h2>
        </div>

        <div className="reveal-up mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {WHY_US.map((line) => (
            <div
              key={line}
              className="flex items-start gap-3 rounded-2xl border border-black/10 p-5 text-[14.5px] text-black/70"
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: RED }}
              >
                <svg
                  viewBox="0 0 12 12"
                  className="h-3 w-3"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M2.5 6.5l2.2 2.2L9.5 3.5" />
                </svg>
              </span>
              {line}
            </div>
          ))}
        </div>

        <div className="reveal-up mt-14 text-center">
          <a
            href="#request"
            className="inline-block rounded-full px-8 py-4 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
            style={{ backgroundColor: BLACK }}
          >
            Request employees now
          </a>
        </div>
      </section>

      <style>{`
        .form-input {
          width: 100%;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 10px;
          padding: 10px 13px;
          font-size: 14px;
          color: #000;
          background: #fff;
        }
        .form-input::placeholder { color: rgba(0,0,0,0.35); }
        .form-input:focus { outline: none; border-color: #000; }
      `}</style>
    </div>
  );
};

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-black/70">
        {label}
        {required && <span style={{ color: RED }}> *</span>}
      </span>
      {children}
    </label>
  );
}

export default Employers;
