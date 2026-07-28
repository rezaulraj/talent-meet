import React, { useEffect, useRef } from "react";
import gsap from "gsap";

// Grounded in the real sitemap rather than abstract shapes — each tile is an
// industry you actually serve, so the color-coded bento panel means something.
const TILES = [
  {
    label: "Construction",
    color: "bg-brand-teal",
    tint: "bg-brand-teal/55",
    image:
      "https://images.unsplash.com/photo-1653280662710-1cac52cde6d7?auto=format&fit=crop&w=900&q=80",
    span: "col-span-2 row-span-2",
    rot: -6,
    icon: (
      <path
        d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Agriculture",
    color: "bg-brand-indigo",
    tint: "bg-brand-indigo/60",
    image:
      "https://plus.unsplash.com/premium_photo-1661907005604-cec7ffb6a042?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    span: "col-span-2 row-span-1",
    rot: 5,
    icon: (
      <path
        d="M8 3v3M16 3v3M4 8h16M6 8v10a2 2 0 002 2h8a2 2 0 002-2V8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Healthcare",
    color: "bg-brand-crimson",
    tint: "bg-brand-crimson/55",
    image:
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=700&q=80",
    span: "col-span-1 row-span-1",
    rot: -4,
    icon: (
      <path
        d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.4-9.5 9-9.5 9z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Hospitality",
    color: "bg-brand-amber",
    tint: "bg-brand-amber/50",
    image:
      "https://images.unsplash.com/photo-1757889692998-d851b95f912e?auto=format&fit=crop&w=700&q=80",
    span: "col-span-1 row-span-1",
    rot: 7,
    icon: (
      <path
        d="M4 21V10a1 1 0 011-1h3a1 1 0 011 1v11M12 21V4h8v17M8 14h.01M17 8h.01"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Logistics",
    color: "bg-brand-sky",
    tint: "bg-brand-sky/55",
    image:
      "https://images.unsplash.com/photo-1740914994657-f1cdffdc418e?auto=format&fit=crop&w=700&q=80",
    span: "col-span-1 row-span-2",
    rot: -5,
    icon: (
      <path
        d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Manufacturing",
    color: "bg-brand-green",
    tint: "bg-brand-green/50",
    image:
      "https://images.unsplash.com/photo-1742281692582-3507d7219c33?auto=format&fit=crop&w=900&q=80",
    span: "col-span-3 row-span-2",
    rot: 4,
    icon: (
      <path
        d="M3 21h18M5 21V9l4 2V9l4 2V9l4 2v10"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const HeroHome = () => {
  const rootRef = useRef(null);
  const tileRefs = useRef([]);
  const quickRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column — text reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".hh-eyebrow", { opacity: 1, y: 0, duration: 0.6 })
        .to(".hh-line span", { y: "0%", duration: 1, stagger: 0.1 }, "-=0.3")
        .to(".hh-sub", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
        .to(".hh-cta", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5");

      // Right column — tiles land like they're being placed down,
      // each with its own tilt and timing so it reads as handmade, not looped.
      tileRefs.current.forEach((el, i) => {
        if (!el) return;
        const rot = TILES[i].rot;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.6, rotate: rot * 2.2, y: 40 },
          {
            opacity: 1,
            scale: 1,
            rotate: rot,
            y: 0,
            duration: 0.9,
            delay: 0.35 + i * 0.12,
            ease: "back.out(1.5)",
            onComplete: () => {
              // idle float once settled — small, staggered, never in sync
              gsap.to(el, {
                y: "+=8",
                duration: 2.4 + i * 0.3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            },
          },
        );

        quickRefs.current[i] = {
          x: gsap.quickTo(el, "rotationY", {
            duration: 0.5,
            ease: "power3.out",
          }),
          y: gsap.quickTo(el, "rotationX", {
            duration: 0.5,
            ease: "power3.out",
          }),
        };
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleMove = (i) => (e) => {
    const el = tileRefs.current[i];
    if (!el || !quickRefs.current[i]) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    quickRefs.current[i].x(px * 14);
    quickRefs.current[i].y(-py * 14);
  };

  const handleLeave = (i) => () => {
    if (!quickRefs.current[i]) return;
    quickRefs.current[i].x(0);
    quickRefs.current[i].y(0);
  };

  return (
    <section ref={rootRef} className="w-full bg-primary-bg font-arimo">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-32 lg:px-12">
        {/* LEFT — copy */}
        <div className="max-w-xl">
          <span className="hh-eyebrow mb-6 inline-flex translate-y-3 items-center gap-2.5 text-[12.5px] font-semibold tracking-[0.2em] text-gray-700 opacity-0">
            <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
            TRUSTED BY EMPLOYERS IN 20+ COUNTRIES
          </span>

          <h1 className="text-[2.2rem] font-semibold leading-[1.15] tracking-[-0.01em] text-black sm:text-[2.7rem] lg:text-[3.2rem]">
            <div className="hh-line overflow-hidden">
              <span className="inline-block translate-y-[110%] will-change-transform">
                Great teams aren't
              </span>
            </div>
            <div className="hh-line overflow-hidden">
              <span className="inline-block translate-y-[110%] will-change-transform">
                built by chance.
              </span>
            </div>
            <div className="hh-line overflow-hidden">
              <span className="inline-block translate-y-[110%] text-brand-crimson will-change-transform">
                They're built by us.
              </span>
            </div>
          </h1>

          <p className="hh-sub mt-8 translate-y-4 text-[16.5px] leading-relaxed text-ink-light opacity-0">
            We source, screen, and place skilled professionals for employers who
            can't afford a bad hire — across construction, healthcare,
            technology, and a dozen industries in between. Every candidate
            vetted. Every placement tracked. No surprises after day one.
          </p>

          <div className="hh-cta mt-10 flex translate-y-4 flex-wrap gap-4 opacity-0">
            <a
              href="/contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-tl-2xl rounded-br-2xl bg-black px-8 py-4 text-[14.5px] font-semibold text-primary-bg transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
            >
              <span className="absolute inset-0 bg-[linear-gradient(120deg,#2632E0,#01C2FB,#027A68,#F8AF3C,#D50042)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative z-10">Build your Dream Team →</span>
            </a>
            <a
              href="/employers/request-employees"
              className="inline-flex items-center rounded-tl-2xl rounded-br-2xl border-[1.5px] border-ink/15 px-8 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:-translate-y-1 hover:border-ink/35 hover:bg-ink/[0.03]"
            >
              Request Employees
            </a>
          </div>
        </div>

        {/* RIGHT — bento reveal panel */}
        <div className="mx-auto grid aspect-square w-full max-w-[560px] grid-cols-4 grid-rows-4 gap-4">
          {TILES.map((tile, i) => (
            <div
              key={tile.label}
              ref={(el) => (tileRefs.current[i] = el)}
              onMouseMove={handleMove(i)}
              onMouseLeave={handleLeave(i)}
              style={{ transformPerspective: 600 }}
              className={`${tile.span} ${tile.color} relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] p-5 opacity-0 shadow-[0_18px_40px_-14px_rgba(23,27,46,0.35)] will-change-transform`}
            >
              {/* real photography, grounding the tile in an actual industry */}
              <img
                src={tile.image}
                alt={tile.label}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              {/* brand-color tint so the palette still reads as one system */}
              <span
                className={`absolute inset-0 ${tile.tint} mix-blend-multiply`}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="relative z-10 h-6 w-6 text-primary-bg/90"
              >
                {tile.icon}
              </svg>
              <span className="relative z-10 text-[15px] font-semibold text-primary-bg drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
                {tile.label}
              </span>

              {/* soft top-light sheen for a tactile, "real material" feel */}
              <span className="pointer-events-none absolute -left-6 -top-10 z-10 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
