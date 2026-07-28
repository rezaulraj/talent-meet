import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Globe2,
  Mail,
  MessageSquareText,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";

const industries = [
  "Construction",
  "Manufacturing",
  "Hospitality",
  "Healthcare",
  "Agriculture & Farming",
  "Transportation & Logistics",
  "Cleaning & Facility Management",
  "Oil, Gas & Energy",
  "Retail & Supermarkets",
  "Food Processing",
];

const INFO_ITEMS = [
  {
    icon: Mail,
    title: "Email",
    text: "hello@talentmeet.com",
    color: "#2632E0",
  },
  {
    icon: UsersRound,
    title: "Hiring Support",
    text: "Bulk hiring, skilled workers, and workforce planning.",
    color: "#01C2FB",
  },
  {
    icon: Globe2,
    title: "Global Offices",
    text: "Glasgow, United Kingdom and Dhaka, Bangladesh.",
    color: "#027A68",
  },
];

const GetInTouchForm = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".touch-reveal", {
        y: 35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(".touch-word", {
        y: 45,
        opacity: 0,
        rotateX: 55,
        duration: 0.9,
        stagger: 0.05,
        delay: 0.2,
        ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact-form"
      ref={sectionRef}
      className="bg-primary-bg py-20 font-arimo lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="touch-reveal rounded-[2.25rem] border border-ink/8 bg-white p-7 shadow-[0_20px_44px_-28px_rgba(23,27,46,0.2)] sm:p-9 lg:sticky lg:top-24 lg:self-start">
            <span className="mb-5 inline-flex items-center gap-2.5 text-[12.5px] font-semibold tracking-[0.2em] text-ink-light">
              <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
              GET IN TOUCH
            </span>

            <h2 className="text-[2rem] font-semibold tracking-[-0.02em] text-black sm:text-[2.4rem]">
              {[
                "Tell",
                "us",
                "what",
                "kind",
                "of",
                "workers",
                "you",
                "need",
              ].map((word) => (
                <span key={word} className="inline-block overflow-hidden px-1">
                  <span className="touch-word inline-block">{word}</span>
                </span>
              ))}
            </h2>

            <p className="mt-5 text-[14px] leading-relaxed text-ink-light">
              Share your hiring requirements and our recruitment specialists
              will review your inquiry and guide you with the right workforce
              solution.
            </p>

            <div className="mt-8 space-y-4">
              {INFO_ITEMS.map(({ icon: Icon, title, text, color }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-[1.5rem] border border-ink/8 bg-ink/[0.02] p-4"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}16` }}
                  >
                    <Icon size={20} strokeWidth={2.2} color={color} />
                  </div>
                  <div>
                    <h3 className="text-[13.5px] font-bold text-ink">
                      {title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-snug text-ink-light">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form className="touch-reveal rounded-[2.25rem] border border-ink/8 bg-white p-5 shadow-[0_20px_44px_-28px_rgba(23,27,46,0.2)] sm:p-7 lg:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                icon={UserRound}
                label="Full Name"
                type="text"
                placeholder="Your name"
              />
              <Field
                icon={Building2}
                label="Company Name"
                type="text"
                placeholder="Company name"
              />
              <Field
                icon={Mail}
                label="Email Address"
                type="email"
                placeholder="you@company.com"
              />
              <Field
                icon={Phone}
                label="Phone Number"
                type="tel"
                placeholder="+44..."
              />
              <Field
                icon={Globe2}
                label="Country"
                type="text"
                placeholder="Your country"
              />
              <Field
                icon={UsersRound}
                label="Workers Needed"
                type="text"
                placeholder="Example: 20 workers"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-[13.5px] font-bold text-ink">
                Industry
              </label>
              <div className="relative">
                <BriefcaseBusiness
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light"
                />
                <select className="h-14 w-full appearance-none rounded-2xl border border-ink/10 bg-ink/[0.02] pl-12 pr-4 text-[13.5px] font-medium text-ink outline-none transition-all duration-300 focus:border-brand-indigo focus:bg-white">
                  <option value="">Select industry</option>
                  {industries.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-[13.5px] font-bold text-ink">
                Message
              </label>
              <div className="relative">
                <MessageSquareText
                  size={18}
                  className="absolute left-4 top-5 text-ink-light"
                />
                <textarea
                  rows="6"
                  placeholder="Tell us about your hiring requirement, timeline, country, job roles and number of workers needed..."
                  className="w-full resize-none rounded-2xl border border-ink/10 bg-ink/[0.02] px-4 py-4 pl-12 text-[13.5px] font-medium text-ink outline-none transition-all duration-300 placeholder:text-ink-light/60 focus:border-brand-indigo focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative mt-7 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-4 text-[14px] font-bold text-primary-bg transition-transform duration-500 hover:-translate-y-1 sm:w-auto"
            >
              <span className="absolute inset-0 bg-[linear-gradient(120deg,#2632E0,#01C2FB,#027A68,#F8AF3C,#D50042)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative z-10">Send Inquiry</span>
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Field = ({ icon: Icon, label, type, placeholder }) => {
  return (
    <div>
      <label className="mb-2 block text-[13.5px] font-bold text-ink">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light"
        />
        <input
          type={type}
          placeholder={placeholder}
          className="h-14 w-full rounded-2xl border border-ink/10 bg-ink/[0.02] pl-12 pr-4 text-[13.5px] font-medium text-ink outline-none transition-all duration-300 placeholder:text-ink-light/60 focus:border-brand-indigo focus:bg-white"
        />
      </div>
    </div>
  );
};

export default GetInTouchForm;
