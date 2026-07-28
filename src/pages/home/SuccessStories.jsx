import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const STORIES = [
  {
    tag: "CANDIDATE STORY",
    name: "Amara K.",
    role: "Warehouse Supervisor — placed in Poland",
    color: "#2632E0",
    image:
      "https://images.unsplash.com/photo-1565793244233-3d09028aad47?w=400&h=400&fit=crop&q=80",
    quote:
      "They didn't just send resumes. They called before I even asked, with an update I actually needed.",
  },
  {
    tag: "EMPLOYER STORY",
    name: "Daniel R.",
    role: "Operations Manager · Retail client",
    color: "#01C2FB",
    image:
      "https://images.unsplash.com/photo-1667996113116-02fe641c5528?w=400&h=400&fit=crop&q=80",
    quote:
      "We filled twelve roles in three weeks during peak season. I didn't think that was possible.",
  },
  {
    tag: "CANDIDATE STORY",
    name: "Farhan T.",
    role: "Construction Foreman — placed in Croatia",
    color: "#027A68",
    image:
      "https://images.unsplash.com/photo-1549043671-1e4550948355?w=400&h=400&fit=crop&q=80",
    quote:
      "The visa process usually takes months. Ours took five weeks, and they chased every document themselves.",
  },
  {
    tag: "EMPLOYER STORY",
    name: "Priya M.",
    role: "Engineering Lead · Technology client",
    color: "#F8AF3C",
    image:
      "https://images.unsplash.com/photo-1489507423881-4df2d5eb5d06?w=400&h=400&fit=crop&q=80",
    quote:
      "Every candidate they sent had already passed the technical test. We stopped wasting interview slots.",
  },
  {
    tag: "CANDIDATE STORY",
    name: "Elena V.",
    role: "Registered Nurse — placed in Romania",
    color: "#D50042",
    image:
      "https://images.unsplash.com/photo-1565719086570-e960dca4184e?w=400&h=400&fit=crop&q=80",
    quote:
      "I got a call two months after I started, just to ask how it was going. No one does that.",
  },
  {
    tag: "EMPLOYER STORY",
    name: "Grace O.",
    role: "HR Director · Manufacturing client",
    color: "#50A153",
    image:
      "https://images.unsplash.com/photo-1758518727888-ffa196002e59?w=400&h=400&fit=crop&q=80",
    quote:
      "Our retention with their hires is night and day compared to the last agency we used.",
  },
];

const SuccessStories = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const progressRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ss-reveal", {
        y: 45,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const current = progressRefs.current[active];

    progressRefs.current.forEach((bar, index) => {
      if (!bar) return;
      gsap.killTweensOf(bar);
      gsap.set(bar, { width: index < active ? "100%" : "0%" });
    });

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 25, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
    );

    if (current) {
      gsap.to(current, {
        width: "100%",
        duration: 5,
        ease: "none",
        onComplete: () => {
          setActive((prev) => (prev + 1) % STORIES.length);
        },
      });
    }

    return () => {
      if (current) gsap.killTweensOf(current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const item = STORIES[active];

  return (
    <section
      ref={sectionRef}
      className="bg-primary-bg py-20 font-arimo lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ss-reveal mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-bold tracking-[0.2em] text-ink-light">
            <span className="h-[7px] w-[7px] rounded-full bg-[linear-gradient(120deg,#2632E0,#01C2FB)]" />
            SUCCESS STORIES
          </span>
          <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.01em] text-black sm:text-[2.8rem]">
            Real people. Real placements. Real words.
          </h2>
        </div>

        <div
          ref={contentRef}
          className="ss-reveal mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.4fr]"
        >
          <div className="flex justify-center lg:justify-start">
            <div className="relative h-56 w-56 sm:h-64 sm:w-64">
              <div
                className="absolute inset-0 rounded-full transition-colors duration-500"
                style={{ border: `14px solid ${item.color}` }}
              />
              <div className="absolute inset-[28px] overflow-hidden rounded-full bg-ink/5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div
                className="absolute -right-5 bottom-8 h-20 w-20 rounded-full border-[12px] bg-primary-bg transition-colors duration-500 sm:h-24 sm:w-24"
                style={{ borderColor: item.color }}
              />
            </div>
          </div>

          <div>
            <h3
              className="mb-8 text-[13px] font-bold tracking-[0.15em] transition-colors duration-500"
              style={{ color: item.color }}
            >
              {item.tag}
            </h3>

            <div className="relative">
              <span className="absolute -left-8 -top-5 text-7xl font-black leading-none text-ink/10 sm:-left-12">
                &ldquo;
              </span>

              <p className="max-w-2xl text-lg leading-8 text-ink">
                {item.quote}
              </p>

              <span className="absolute -right-2 bottom-0 text-7xl font-black leading-none text-ink/10 sm:-right-6">
                &rdquo;
              </span>
            </div>

            <div className="mt-8">
              <h4 className="text-base font-bold text-black">{item.name}</h4>
              <p className="mt-1 text-sm text-ink-light">{item.role}</p>
            </div>
          </div>
        </div>

        <div className="ss-reveal mx-auto mt-14 flex max-w-xl items-center gap-1.5 overflow-hidden">
          {STORIES.map((s, index) => (
            <button
              key={s.name}
              onClick={() => setActive(index)}
              aria-label={`Show story from ${s.name}`}
              className="relative h-2 flex-1 overflow-hidden rounded-full bg-ink/10"
            >
              <div
                ref={(el) => (progressRefs.current[index] = el)}
                className="absolute left-0 top-0 h-full w-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
