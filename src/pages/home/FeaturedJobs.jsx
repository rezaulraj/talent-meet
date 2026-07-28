import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const JOBS = [
  {
    title: "Warehouse Operative",
    industry: "Logistics",
    location: "United Kingdom",
    flag: "🇬🇧",
    type: "Full-time",
    color: "#01C2FB",
    badge: null,
  },

  {
    title: "Site Supervisor",
    industry: "Construction",
    location: "Croatia",
    flag: "🇭🇷",
    type: "Contract",
    color: "#027A68",
    badge: null,
  },
  {
    title: "Front Desk Agent",
    industry: "Hospitality",
    location: "Slovenia",
    flag: "🇸🇮",
    type: "Full-time",
    color: "#F8AF3C",
    badge: null,
  },
  {
    title: "CNC Machine Operator",
    industry: "Manufacturing",
    location: "Serbia",
    flag: "🇷🇸",
    type: "Full-time",
    color: "#50A153",
    badge: null,
  },
  {
    title: "Fleet Driver",
    industry: "Logistics",
    location: "Latvia",
    flag: "🇱🇻",
    type: "Full-time",
    color: "#01C2FB",
    badge: "New",
  },
  {
    title: "ICU Nurse",
    industry: "Healthcare",
    location: "United Kingdom",
    flag: "🇬🇧",
    type: "Contract",
    color: "#D50042",
    badge: "Urgent",
  },
  {
    title: "Industrial Electrician",
    industry: "Construction",
    location: "Romania",
    flag: "🇷🇴",
    type: "Full-time",
    color: "#027A68",
    badge: null,
  },
];

const FeaturedJobs = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const hoverRef = useRef(false);
  const xRef = useRef(0);
  const setWidthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    // measure one full set (half the duplicated track) once laid out
    setWidthRef.current = track.scrollWidth / 2;

    let raf;
    const speed = 42; // px per second
    let last = performance.now();

    function frame(now) {
      const dt = (now - last) / 1000;
      last = now;
      const targetSpeed = hoverRef.current ? 0 : speed;
      // ease current effective speed toward target so pause/resume is smooth, not a jump-cut
      frame.currentSpeed = gsap.utils.interpolate(
        frame.currentSpeed ?? speed,
        targetSpeed,
        0.08,
      );

      xRef.current -= frame.currentSpeed * dt;
      if (Math.abs(xRef.current) >= setWidthRef.current) {
        xRef.current += setWidthRef.current;
      }
      track.style.transform = `translateX(${xRef.current}px)`;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".fj-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.fromTo(
        ".fj-marquee",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
      gsap.to(".fj-cta", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const renderCard = (job, key) => (
    <div
      key={key}
      className="group relative flex w-[280px] shrink-0 flex-col gap-4 rounded-[1.5rem] border border-ink/8 bg-white p-6 shadow-[0_14px_34px_-20px_rgba(23,27,46,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-18px_rgba(23,27,46,0.3)]"
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.04em]"
          style={{ backgroundColor: `${job.color}1a`, color: job.color }}
        >
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{ backgroundColor: job.color }}
          />
          {job.industry.toUpperCase()}
        </span>
        {job.badge && (
          <span
            className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-[0.04em] ${
              job.badge === "Urgent"
                ? "bg-brand-crimson/10 text-brand-crimson"
                : "bg-brand-teal/10 text-brand-teal"
            }`}
          >
            {job.badge.toUpperCase()}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-[16.5px] font-semibold leading-snug text-ink">
          {job.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-ink-light">
          <span>{job.flag}</span> {job.location} · {job.type}
        </p>
      </div>

      <a
        href="/jobs"
        className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all duration-300 group-hover:gap-2.5"
        style={{ color: job.color }}
      >
        View role <span aria-hidden>→</span>
      </a>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-primary-bg py-24 font-arimo"
    >
      <div className="mx-auto max-w-3xl translate-y-4 px-6 text-center opacity-0 fj-header sm:px-8">
        <span className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-bold tracking-[0.2em] text-ink-light">
          <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
          FEATURED JOBS
        </span>
        <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] text-ink sm:text-[2.5rem]">
          Open right now, not last quarter.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-ink-light">
          Hover to pause and read one closely — the row eases to a stop, it
          doesn't freeze.
        </p>
      </div>

      <div
        className="fj-marquee relative mt-14 opacity-0"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
      >
        <div
          ref={trackRef}
          className="flex gap-6 px-6 will-change-transform sm:px-8"
        >
          {JOBS.map((job, i) => renderCard(job, `a-${i}`))}
          {JOBS.map((job, i) => renderCard(job, `b-${i}`))}
        </div>
      </div>

      <div className="fj-cta mt-14 flex translate-y-4 justify-center opacity-0">
        <a
          href="/jobs"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-8 py-4 text-[14.5px] font-semibold text-primary-bg transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
        >
          <span className="absolute inset-0 bg-[linear-gradient(120deg,#2632E0,#01C2FB,#027A68,#F8AF3C,#D50042)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="relative z-10">View All Open Roles →</span>
        </a>
      </div>
    </section>
  );
};

export default FeaturedJobs;
