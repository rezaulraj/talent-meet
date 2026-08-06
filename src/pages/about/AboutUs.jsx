import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "@vnedyalk0v/react19-simple-maps";

gsap.registerPlugin(ScrollTrigger);

const BLACK = "#000000";
const RED = "#D50042";
const BRAND = "Talent Grid";

const PENTAGON_CLIP = "polygon(16% 0%, 100% 0%, 100% 100%, 16% 100%, 0% 50%)";

const HERO_SHAPE = "polygon(0% 0%, 88% 0%, 66% 100%, 0% 100%)";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const SERVED_COUNTRIES = new Set(
  [
    "Philippines",
    "India",
    "Nepal",
    "Bangladesh",
    "Sri Lanka",
    "Indonesia",
    "Pakistan",
    "Kenya",
    "Saudi Arabia",
    "United Arab Emirates",
    "Qatar",
    "Kuwait",
    "United Kingdom",
    "Germany",
    "Poland",
    "Crotia",
    "Serbia",
    "Romania",
  ].map((c) => c.toLowerCase()),
);

const HUBS = [
  { name: "Dhaka", coords: [90.4125, 23.8103] },
  //   { name: "Manila", coords: [120.9842, 14.5995] },
  { name: "Colombo", coords: [79.8612, 6.9271] },
  { name: "Dubai", coords: [55.2708, 25.2048] },
  { name: "Riyadh", coords: [46.6753, 24.7136] },
  { name: "Doha", coords: [51.531, 25.2854] },
  { name: "London", coords: [-0.1276, 51.5072] },
  { name: "Nairobi", coords: [36.8219, -1.2921] },
  //   { name: "Kuala Lumpur", coords: [101.6869, 3.139] },
];

const STATS = [
  { value: "12", label: "Years placing people" },
  { value: "40+", label: "Countries served" },
  { value: "15,000+", label: "Placements made" },
  { value: "98%", label: "Visa approval rate" },
];

const VALUES = [
  {
    title: "We follow through",
    desc: "Sourcing a candidate is the easy part. We stay on the case through screening, paperwork, and the first pay cycle — not just the placement fee.",
    icon: (
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zM9 12l2 2 4-4" />
    ),
  },
  {
    title: "We tell you the truth",
    desc: "If a candidate isn't right, we say so before you find out the hard way. Honest screening protects your business more than a fast placement does.",
    icon: (
      <path d="M9 12h6M9 16h6M9 8h3M6 4h12a2 2 0 012 2v14l-4-3-4 3-4-3-4 3V6a2 2 0 012-2z" />
    ),
  },
  {
    title: "We work at scale, carefully",
    desc: "Whether it's one executive hire or a thousand-person deployment, the same screening and compliance standard applies — volume never becomes an excuse.",
    icon: (
      <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 3.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zM19 8v6M22 11h-6" />
    ),
  },
  {
    title: "We know the paperwork",
    desc: "Visas, work permits, statutory compliance across a dozen jurisdictions — that knowledge is the actual product, not the part we outsource.",
    icon: (
      <path d="M6 3h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM14 3v5h5M9 14l2 2 4-4" />
    ),
  },
];

/* Placeholder leadership — swap photos and names for your real team. */
const TEAM = [
  {
    name: "Priya Anand",
    role: "Head of Overseas Recruitment",
    img: "https://images.unsplash.com/photo-1758518729459-235dcaadc611",
  },
  {
    name: "Daniel Osei",
    role: "Director of Compliance",
    img: "https://images.unsplash.com/photo-1742518424481-b39a7cb4c80e",
  },
  {
    name: "Marcus Bell",
    role: "Head of Client Partnerships",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
  {
    name: "Amara Johnson",
    role: "Head of Candidate Screening",
    img: "https://images.unsplash.com/photo-1573496527892-904f897eb744",
  },
];

/* Nodes for the snake progress rail — one per section it runs past.
   "About" isn't included: the rail only exists in the wrapper that
   starts AFTER the hero, per the "not fixed over the whole page, only
   after the hero" note. */
const RAIL_NODES = [
  "Overview",
  "Mission",
  "Presence",
  "Values",
  "Team",
  "Contact",
];
const RAIL_WIDTH = 56;

/* -------------------------------------------------------------------- */
/*  World map data — fetched manually so we control the loading/error   */
/*  states ourselves instead of relying on the library's internal       */
/*  fetch (whose failure surfaces as the bare "Failed to load geography */
/*  data" string with no way to recover from it in the UI).             */
/* -------------------------------------------------------------------- */
function useWorldGeoData(url) {
  const [state, setState] = useState({ status: "loading", data: null });

  const load = useCallback(() => {
    let cancelled = false;
    setState({ status: "loading", data: null });

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((err) => {
        // Surfaced in the console for real debugging; the UI shows a
        // calmer message plus a retry button instead of a dead component.
        console.error("World map data failed to load:", err);
        if (!cancelled) setState({ status: "error", data: null });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => load(), [load]);

  return { ...state, retry: load };
}

const AboutUs = () => {
  const rootRef = useRef(null);
  const railWrapRef = useRef(null);
  const railCanvasRef = useRef(null);
  const sectionRefs = useRef([]);
  const railNodesRef = useRef([]);
  const railProgressRef = useRef(0);
  const railButtonRefs = useRef([]);

  const geo = useWorldGeoData(GEO_URL);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const canvas = railCanvasRef.current;
    const ctx2d = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    let pathPoints = [];
    let railHeight = 0;

    function ease(t) {
      return 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
    }

    function xAt(nodes, y) {
      if (nodes.length === 0) return RAIL_WIDTH / 2;
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

    function measureRail() {
      if (!railWrapRef.current) return;
      railHeight = railWrapRef.current.offsetHeight;
      canvas.width = RAIL_WIDTH * dpr;
      canvas.height = railHeight * dpr;
      canvas.style.width = `${RAIL_WIDTH}px`;
      canvas.style.height = `${railHeight}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

      const leftX = RAIL_WIDTH * 0.32;
      const rightX = RAIL_WIDTH * 0.68;

      // Node y = the real vertical position of each section inside the
      // wrapper, so the rail actually reflects page layout in real time
      // rather than guessing at even spacing.
      const nodes = sectionRefs.current.map((el, i) => ({
        label: RAIL_NODES[i],
        x: i % 2 === 0 ? leftX : rightX,
        y: el ? el.offsetTop - railWrapRef.current.offsetTop : 0,
      }));
      railNodesRef.current = nodes;

      const points = [];
      for (let y = 0; y <= railHeight; y += 4) {
        points.push({ x: xAt(nodes, y), y });
      }
      pathPoints = points;

      railButtonRefs.current.forEach((btn, i) => {
        if (!btn) return;
        const node = nodes[i];
        btn.style.left = `${node.x}px`;
        btn.style.top = `${node.y}px`;
      });
    }

    function pointAtY(points, y) {
      if (points.length === 0) return { x: RAIL_WIDTH / 2, y: 0 };
      let closest = points[0];
      for (const p of points) {
        if (p.y > y) break;
        closest = p;
      }
      return closest;
    }

    function drawRail() {
      const progressY = railProgressRef.current * railHeight;
      ctx2d.clearRect(0, 0, RAIL_WIDTH, railHeight);

      ctx2d.strokeStyle = "rgba(120,120,120,0.45)";
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

      const head = pointAtY(pathPoints, progressY);
      for (let i = 4; i >= 1; i--) {
        const trail = pointAtY(pathPoints, progressY - i * 6);
        ctx2d.beginPath();
        ctx2d.arc(trail.x, trail.y, 3 - i * 0.35, 0, Math.PI * 2);
        ctx2d.fillStyle = `rgba(213,0,66,${0.1 * (5 - i)})`;
        ctx2d.fill();
      }
      if (progressY > 2 && progressY < railHeight - 2) {
        ctx2d.save();
        ctx2d.shadowColor = "rgba(213,0,66,0.7)";
        ctx2d.shadowBlur = 10;
        ctx2d.beginPath();
        ctx2d.arc(head.x, head.y, 5.5, 0, Math.PI * 2);
        ctx2d.fillStyle = RED;
        ctx2d.fill();
        ctx2d.restore();
      }

      railNodesRef.current.forEach((node, i) => {
        const btn = railButtonRefs.current[i];
        if (!btn) return;
        const passed = node.y <= progressY + 4;
        btn.style.backgroundColor = passed ? RED : "#9a9a9a";
      });
    }

    measureRail();
    drawRail();
    const onResize = () => {
      measureRail();
      drawRail();
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
            ".hero-media",
            ".reveal-up",
            ".reveal-fade",
            ".map-hub",
            ".rail-node-btn",
          ],
          { opacity: 1, clearProps: "all" },
        );
        railProgressRef.current = 1;
        drawRail();
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });
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
        .from(".hero-media", { xPercent: -10, opacity: 0, duration: 1.1 }, 0.05)
        .from(
          ".hero-media img",
          { scale: 1.18, duration: 1.6, ease: "power2.out" },
          0.05,
        );

      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      gsap.utils.toArray(".reveal-fade").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      gsap.from(".stat-band-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".stat-band", start: "top 80%" },
      });

      gsap.from(".map-hub", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "back.out(2.2)",
        scrollTrigger: { trigger: ".world-map", start: "top 75%" },
      });

      gsap.utils.toArray(".team-card").forEach((el, i) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      /* Progress is scoped to the post-hero wrapper only — 0 right as
         it enters view (i.e. right after the hero), 1 once its bottom
         reaches the bottom of the viewport. Real-time, tied to actual
         scroll position, not a fixed overlay. */
      ScrollTrigger.create({
        trigger: railWrapRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          railProgressRef.current = self.progress;
          drawRail();
        },
      });

      ScrollTrigger.addEventListener("refreshInit", measureRail);
    }, rootRef);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.status]);

  const scrollToSection = (i) => {
    sectionRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div ref={rootRef} className="relative font-arimo bg-[#FFFEF9] text-black">
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

      <section className="relative min-h-[90vh] overflow-hidden bg-[#FFFEF9] py-10">
        <div className="relative h-64 w-full md:hidden">
          <img
            src="https://images.unsplash.com/photo-1758873268663-5a362616b5a7?auto=format&fit=crop&w=1200&q=80"
            alt="The Talent Grid team in the office"
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
        </div>

        <div
          className="hero-media absolute inset-y-0 left-0 z-0 hidden w-[58%] md:block"
          style={{ clipPath: HERO_SHAPE }}
        >
          <img
            src="https://images.unsplash.com/photo-1758873268663-5a362616b5a7?auto=format&fit=crop&w=1600&q=80"
            alt="The Talent Grid team in the office"
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10" />
          <div
            className="absolute inset-y-0 right-0 w-3"
            style={{ backgroundColor: RED }}
          />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[90vh] max-w-7xl md:grid-cols-2">
          <div className="hidden md:block" />
          <div className="flex flex-col justify-center px-6 py-24 sm:px-10 lg:px-16">
            <div className="hero-eyebrow mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-black/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-black/70">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: RED }}
              />
              About Us
            </div>

            <h1 className="max-w-xl text-[38px] font-bold leading-[1.12] text-black sm:text-[48px] lg:text-[54px]">
              <span className="block overflow-hidden">
                <span className="hero-line block">We built the agency</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block">
                  we wished <span style={{ color: RED }}>existed</span>
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block">when we started.</span>
              </span>
            </h1>

            <p className="hero-sub mt-6 max-w-md text-[15.5px] leading-relaxed text-black/60">
              Talent Grid started because too many placements fell apart after
              the offer letter — lost in a visa queue, dropped between agencies,
              forgotten after the invoice was paid. Twelve years later, we're
              the team that stays on the case until someone's actually settled.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#overview"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-tl-2xl rounded-br-2xl bg-black px-8 py-4 text-[14.5px] font-semibold text-primary-bg transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                style={{ backgroundColor: RED }}
              >
                <span className="absolute inset-0 bg-[linear-gradient(120deg,#000000,#000008,#D50042)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10">Company overview</span>
              </a>
              <a
                href="#team"
                className="inline-flex items-center rounded-tl-2xl rounded-br-2xl border-[1.5px] border-ink/15 px-8 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:-translate-y-1 hover:border-ink/35 hover:bg-ink/[0.03]"
              >
                Meet the team
              </a>
            </div>
          </div>
        </div>
      </section>

      <div ref={railWrapRef} className="relative">
        <div
          className="pointer-events-none absolute left-2 top-0 z-30 hidden lg:block xl:left-6"
          style={{ width: RAIL_WIDTH }}
        >
          <canvas ref={railCanvasRef} className="block" />
          {RAIL_NODES.map((label, i) => (
            <button
              key={label}
              ref={(el) => (railButtonRefs.current[i] = el)}
              onClick={() => scrollToSection(i)}
              title={label}
              aria-label={`Jump to ${label}`}
              className="rail-node-btn pointer-events-auto absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:scale-125"
              style={{ backgroundColor: "#9a9a9a" }}
            />
          ))}
        </div>

        <section
          id="overview"
          ref={(el) => (sectionRefs.current[0] = el)}
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28 lg:pl-24"
        >
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="reveal-up relative aspect-[4/3] overflow-hidden rounded-2xl md:order-1">
              <img
                src="https://images.unsplash.com/photo-1758873269035-aae0e1fd3422?auto=format&fit=crop&w=1000&q=80"
                alt="The Talent Grid team planning at a whiteboard"
                className="h-full w-full object-cover grayscale"
              />
            </div>

            <div className="reveal-up md:order-2">
              <span
                className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: RED }}
              >
                <span
                  className="h-[7px] w-[7px] rounded-full"
                  style={{ backgroundColor: RED }}
                />
                Company Overview
              </span>
              <h2 className="text-[28px] font-bold leading-tight text-black sm:text-[34px]">
                We started as three recruiters and a spreadsheet of visa
                deadlines.
              </h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-black/65">
                Talent Grid opened its doors after its founders spent years
                inside agencies that treated placement as the finish line.
                Candidates landed in a new country with no one answering the
                phone. Clients discovered gaps in documentation months in. We
                built the opposite of that — a single team responsible for a
                case from the first sourcing call to the day someone is actually
                settled into the role.
              </p>
              <p className="mt-4 text-[15.5px] leading-relaxed text-black/65">
                Twelve years on, that's still the whole pitch. We've grown into
                comprehensive coverage across sourcing, screening, compliance,
                payroll, and relocation — operating across more than 40
                countries with local teams, not just contacts on a spreadsheet.
                But the standard hasn't moved: a hire isn't done until it's
                working.
              </p>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28 lg:pl-24"
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
              Our Mission &amp; Vision
            </span>
            <h2 className="text-[30px] font-bold leading-tight text-black sm:text-[38px]">
              What we're building toward.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="reveal-up rounded-3xl bg-black p-9 text-white sm:p-11">
              <span
                className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "rgba(213,0,66,0.18)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={RED}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 2l2.4 6.8L21 11l-6.6 2.2L12 20l-2.4-6.8L3 11l6.6-2.2L12 2z" />
                </svg>
              </span>
              <h3
                className="text-[13px] font-bold uppercase tracking-[0.16em]"
                style={{ color: RED }}
              >
                Mission
              </h3>
              <p className="mt-3 text-[19px] font-semibold leading-snug">
                Move the right person into the right role, anywhere in the
                world, without the process costing them their dignity or costing
                you your timeline.
              </p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-white/60">
                That means comprehensive coverage from the first sourcing call
                to the first pay cycle — sourcing, screening, visas, payroll,
                and relocation, handled by one accountable team instead of four
                disconnected vendors.
              </p>
            </div>

            <div
              className="reveal-up rounded-3xl border-2 p-9 sm:p-11"
              style={{ borderColor: BLACK }}
            >
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={BLACK}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <h3
                className="text-[13px] font-bold uppercase tracking-[0.16em]"
                style={{ color: RED }}
              >
                Vision
              </h3>
              <p className="mt-3 text-[19px] font-semibold leading-snug text-black">
                A recruitment industry where "we'll follow up" is a promise
                agencies actually keep.
              </p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-black/60">
                We want Talent Grid to be the reason a candidate trusts an
                agency again after a bad experience elsewhere, and the reason a
                client stops needing four vendors to do the job one accountable
                partner should.
              </p>
            </div>
          </div>
        </section>

        <section className="stat-band bg-black px-6 py-16 text-white sm:px-10 lg:pl-24">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="stat-band-item">
                <div className="text-3xl font-bold sm:text-4xl">{s.value}</div>
                <div
                  className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: RED }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className="bg-black px-6 py-24 text-white sm:px-10 sm:py-28 lg:pl-24"
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
              Our Global Presence
            </span>
            <h2 className="text-[30px] font-bold leading-tight text-white sm:text-[38px]">
              Comprehensive reach, from sourcing markets to client countries.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/55">
              Red marks the countries we actively source from or place
              candidates into. Each glowing point is a hub with people on the
              ground — not a mailbox.
            </p>
          </div>

          <div className="world-map reveal-fade relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-black p-2 sm:p-6">
            {geo.status === "error" && (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-[15px] font-semibold text-white">
                  The map data didn't load.
                </p>
                <p className="max-w-sm text-[13px] leading-relaxed text-white/55">
                  This is usually a network or CORS block on{" "}
                  <code className="text-white/70">cdn.jsdelivr.net</code> in
                  your environment, not a bug in the page — check your browser's
                  network tab for the blocked request, or self-host the topojson
                  file and point <code className="text-white/70">GEO_URL</code>{" "}
                  at it.
                </p>
                <button
                  onClick={geo.retry}
                  className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: RED }}
                >
                  Retry
                </button>
              </div>
            )}

            {geo.status === "loading" && (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="flex items-center gap-3 text-white/50">
                  <span
                    className="h-2 w-2 animate-pulse rounded-full"
                    style={{ backgroundColor: RED }}
                  />
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em]">
                    Loading world map…
                  </span>
                </div>
              </div>
            )}

            {geo.status === "ready" && (
              <ComposableMap
                projectionConfig={{ scale: 148 }}
                style={{ width: "100%", height: "auto" }}
              >
                <Geographies geography={geo.data}>
                  {({ geographies }) =>
                    geographies.map((g) => {
                      const name = (g.properties?.name || "").toLowerCase();
                      const served = SERVED_COUNTRIES.has(name);
                      return (
                        <Geography
                          key={g.rsmKey}
                          geography={g}
                          style={{
                            default: {
                              fill: served ? RED : "#ffffff",
                              fillOpacity: served ? 0.85 : 0.12,
                              stroke: "#000000",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            hover: {
                              fill: served ? RED : "#ffffff",
                              fillOpacity: served ? 1 : 0.22,
                              stroke: "#000000",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            pressed: {
                              fill: RED,
                              fillOpacity: 1,
                              stroke: "#000000",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>

                {HUBS.map((hub) => (
                  <Marker key={hub.name} coordinates={hub.coords}>
                    <g className="map-hub">
                      <circle r={6} fill={RED} fillOpacity={0.2} />
                      <circle
                        r={2.6}
                        fill={RED}
                        stroke="#ffffff"
                        strokeWidth={0.8}
                      />
                    </g>
                  </Marker>
                ))}
              </ComposableMap>
            )}
          </div>

          <div className="reveal-fade mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/45">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: RED }}
              />
              Active country
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border border-white/40 bg-transparent" />
              Team on the ground
            </span>
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[3] = el)}
          className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:pl-24"
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
              How we work
            </span>
            <h2 className="text-[30px] font-bold leading-tight text-black sm:text-[38px]">
              Four things we don't compromise on.
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="reveal-up rounded-2xl border border-black/10 p-7 transition-colors duration-300 hover:border-black/25"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={RED}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    {v.icon}
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold text-black">{v.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-black/60">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="team"
          ref={(el) => (sectionRefs.current[4] = el)}
          className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:pl-24"
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
              Leadership
            </span>
            <h2 className="text-[30px] font-bold leading-tight text-black sm:text-[38px]">
              The people who stay on the case.
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="team-card">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <img
                    src={`${member.img}?auto=format&fit=crop&w=500&q=80`}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                  />
                </div>
                <h3 className="mt-3 text-[15px] font-bold text-black">
                  {member.name}
                </h3>
                <p className="text-[12.5px] text-black/55">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={(el) => (sectionRefs.current[5] = el)}
          className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-28 lg:pl-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 opacity-[0.04]"
            style={{ backgroundColor: BLACK, clipPath: PENTAGON_CLIP }}
          />
          <div className="reveal-up relative mx-auto max-w-3xl text-center">
            <div
              className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: RED }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: RED }}
              />
              Work with us
            </div>
            <h2 className="text-[32px] font-bold leading-tight text-black sm:text-[42px]">
              Twelve years in, we're still answering the phone ourselves.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-black/60">
              Tell Talent Grid what your workforce needs — sourcing, screening,
              compliance, or relocation. One conversation, one team, start to
              finish.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                className="inline-block rounded-full px-8 py-4 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: BLACK }}
              >
                Start the conversation
              </a>
              <a
                href="#"
                className="inline-block rounded-full border-2 px-8 py-4 text-sm font-bold transition-colors duration-300 hover:bg-black hover:text-white"
                style={{ borderColor: BLACK, color: BLACK }}
              >
                View our services
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
