import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COLUMNS = [
  {
    title: "Solutions",
    links: [
      { label: "Workforce Sourcing", href: "/solutions/workforce-sourcing" },
      {
        label: "Overseas Recruitment",
        href: "/solutions/overseas-recruitment",
      },
      { label: "Executive Search", href: "/solutions/executive-search" },
      { label: "Bulk Hiring", href: "/solutions/bulk-hiring" },
      { label: "Candidate Screening", href: "/solutions/candidate-screening" },
      { label: "Visa & Documentation", href: "/solutions/visa-documentation" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/about/careers" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "News", href: "/news" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faqs" },
      { label: "Candidate Portal", href: "/candidates" },
      { label: "Employer Portal", href: "/employers" },
    ],
  },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.97-1.81-2.97-1.82 0-2.1 1.42-2.1 2.88V21h-4z" />
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <path d="M3 3h4.6l4.1 5.7L16.4 3H21l-6.9 8.9L21.4 21h-4.6l-4.5-6.2L6.6 21H2l7.3-9.4z" />
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.25-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.5 3 14.3 3c-2.5 0-4.2 1.5-4.2 4.4v2.4H7.4v3.2h2.7v8z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="17.2" cy="6.8" r="1.1" />
      </>
    ),
  },
];

const Footer = () => {
  const footerRef = useRef(null);
  const watermarkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".footer-reveal", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 88%" },
      });

      gsap.fromTo(
        watermarkRef.current,
        { backgroundPosition: "0% 0%" },
        {
          backgroundPosition: "200% 0%",
          duration: 8,
          repeat: -1,
          ease: "linear",
        },
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-primary-bg font-arimo"
    >
      <div className="relative w-full leading-[0]">
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="block h-[64px] w-full sm:h-[90px]"
        >
          <defs>
            <linearGradient id="footerCarveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2632E0" />
              <stop offset="20%" stopColor="#01C2FB" />
              <stop offset="40%" stopColor="#027A68" />
              <stop offset="60%" stopColor="#F8AF3C" />
              <stop offset="80%" stopColor="#D50042" />
              <stop offset="100%" stopColor="#50A153" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 C 380,95 1060,95 1440,0 L1440,110 L0,110 Z"
            fill="#171B2E"
          />
          <path
            d="M0,0 C 380,95 1060,95 1440,0"
            fill="none"
            stroke="url(#footerCarveGrad)"
            strokeWidth="3.5"
          />
        </svg>
      </div>

      {/* everything below the curve lives on its own ink-colored layer,
          attached seam-free right under the SVG so the notch above shows
          the page's cream background, not another slab of ink */}
      <div className="relative -mt-px bg-ink">
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-16 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
            <div className="footer-reveal col-span-2 translate-y-4 opacity-0 sm:col-span-3 lg:col-span-1">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
                <span className="text-[19px] font-bold tracking-[-0.01em] text-primary-bg">
                  Talent Meet
                </span>
              </div>
              <p className="max-w-xs text-[13.5px] leading-relaxed text-primary-bg/55">
                Sourcing, screening, and placing skilled people across borders —
                with one team accountable from first search to first day.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  { city: "Dhaka, Bangladesh", role: "Head Office" },
                  { city: "London, United Kingdom", role: "Regional Office" },
                ].map((loc) => (
                  <div key={loc.city} className="flex items-start gap-2.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary-bg/40"
                    >
                      <path
                        d="M12 21s-7-4.6-7-11a7 7 0 0114 0c0 6.4-7 11-7 11z"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="10" r="2.4" />
                    </svg>
                    <div className="text-[13px] leading-snug text-primary-bg/55">
                      <p className="font-semibold text-primary-bg/80">
                        {loc.city}
                      </p>
                      <p>{loc.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-[13px] text-primary-bg/55">
                <a
                  href="mailto:hello@talentmeet.com"
                  className="block transition-colors hover:text-primary-bg"
                >
                  hello@talentmeet.com
                </a>
                {/* <a
                  href="tel:+880000000000"
                  className="block transition-colors hover:text-primary-bg"
                >
                  +880 00 000 0000
                </a> */}
              </div>

              <div className="mt-6 flex gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-bg/15 text-primary-bg/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-indigo/50 hover:text-primary-bg"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {COLUMNS.map((col) => (
              <div
                key={col.title}
                className="footer-reveal translate-y-4 opacity-0"
              >
                <h4 className="mb-4 text-[12px] font-bold uppercase tracking-[0.12em] text-primary-bg/40">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[13.5px] text-primary-bg/65 transition-colors duration-200 hover:text-primary-bg"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-reveal mt-14 flex translate-y-4 flex-col items-center justify-between gap-4 border-t border-primary-bg/10 pt-7 text-[12.5px] text-primary-bg/40 opacity-0 sm:flex-row">
            <p>© {year} Talent Meet. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="/privacy"
                className="transition-colors hover:text-primary-bg/70"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="transition-colors hover:text-primary-bg/70"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div
          className="relative select-none overflow-hidden"
          aria-hidden="true"
        >
          <p
            ref={watermarkRef}
            className="translate-y-[28%] whitespace-nowrap text-center font-black leading-none tracking-[-0.04em]"
            style={{
              fontSize: "clamp(5rem, 17vw, 13rem)",
              backgroundImage:
                "linear-gradient(100deg, rgba(255,254,249,0.05) 0%, rgba(255,254,249,0.05) 40%, rgba(255,254,249,0.16) 50%, rgba(255,254,249,0.05) 60%, rgba(255,254,249,0.05) 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            TALENT MEET
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
