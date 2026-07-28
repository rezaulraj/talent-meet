import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const OFFICES = [
  {
    country: "United Kingdom",
    city: "Glasgow, Scotland",
    address:
      "Hillington Business Centre, 15–17 Nasmyth Rd S, Hillington, Glasgow G52 4RE",
    tag: "Regional Office",
    color: "#2632E0",
  },
  {
    country: "Bangladesh",
    city: "Dhaka",
    address: "Sector 10, Dhaka 1230, Bangladesh",
    tag: "Head Office",
    color: "#D50042",
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
];

const ContactInformation = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-info-reveal",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary-bg py-20 font-arimo"
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-indigo/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-brand-crimson/8 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="contact-info-reveal mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-semibold tracking-[0.2em] text-ink-light">
            <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
            CONTACT INFORMATION
          </span>
          <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-black sm:text-[2.8rem]">
            Reach our global team
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-black/80">
            Connect with our recruitment support team, or visit us in person —
            Dhaka and Glasgow, both open for a conversation.
          </p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="contact-info-reveal flex h-full flex-col justify-between rounded-[2.1rem] border border-ink/8 bg-white p-7 shadow-[0_20px_44px_-24px_rgba(23,27,46,0.2)] sm:p-8">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-indigo/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2632E0"
                  strokeWidth="1.8"
                  className="h-7 w-7"
                >
                  <path d="M4 6h16v12H4z" strokeLinejoin="round" />
                  <path
                    d="M4 7l8 6 8-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="mt-7 text-[1.4rem] font-semibold tracking-[-0.02em] text-ink">
                Email us directly
              </h3>

              <a
                href="mailto:hello@talentmeet.com"
                className="mt-3 block break-all text-[1.5rem] font-semibold tracking-[-0.02em] text-brand-indigo transition-opacity hover:opacity-75 sm:text-[1.75rem]"
              >
                hello@talentmeet.com
              </a>

              <p className="mt-4 text-[14px] leading-relaxed text-ink-light">
                Send your hiring requirements, a partnership inquiry, or a
                general question — a real person reads every message.
              </p>
            </div>

            <div className="mt-8 border-t border-ink/8 pt-6">
              <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-light/70">
                Follow us
              </p>
              <div className="flex flex-wrap gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-indigo/40 hover:text-brand-indigo"
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
          </div>

          <div className="grid content-stretch gap-5 sm:grid-cols-2">
            {OFFICES.map((office, index) => (
              <article
                key={office.country}
                className="contact-info-reveal group flex flex-col justify-between rounded-[1.9rem] border border-ink/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: `0 20px 44px -28px ${office.color}55` }}
              >
                <div>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${office.color}14` }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={office.color}
                        strokeWidth="1.8"
                        className="h-6 w-6"
                      >
                        <path
                          d="M12 21s-7-4.6-7-11a7 7 0 0114 0c0 6.4-7 11-7 11z"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="10" r="2.4" />
                      </svg>
                    </div>
                    <span className="text-[2.5rem] font-black leading-none text-ink/[0.06]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <span
                    className="mb-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{
                      color: office.color,
                      backgroundColor: `${office.color}14`,
                    }}
                  >
                    {office.tag}
                  </span>

                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">
                    {office.country}
                  </h3>
                  <p className="mt-0.5 text-[13px] font-medium text-ink-light">
                    {office.city}
                  </p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-light">
                    {office.address}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="contact-info-reveal mx-auto mt-6 w-fit rounded-[1.9rem] border border-ink/8 bg-white p-7 text-center shadow-[0_20px_44px_-28px_rgba(23,27,46,0.18)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#027A68"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-[1.3rem] font-bold tracking-[-0.02em] text-ink">
            Have a workforce question?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-ink-light">
            Share your requirements and our recruitment specialists will guide
            you with the right hiring support.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactInformation;
