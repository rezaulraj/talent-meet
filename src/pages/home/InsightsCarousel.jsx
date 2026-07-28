import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import gsap from "gsap";

const CATEGORY_COLORS = {
  Skills: "#2632E0",
  Technology: "#01C2FB",
  Branding: "#F8AF3C",
  DEI: "#D50042",
  Remote: "#027A68",
  Experience: "#50A153",
  Trends: "#2632E0",
  Writing: "#01C2FB",
  Tech: "#F8AF3C",
  Analytics: "#027A68",
};

const InsightsCarousel = () => {
  const blogData = useMemo(
    () => [
      {
        id: 1,
        heading: "10 Essential Skills for Modern Recruiters in 2024",
        slug: "essential-skills-for-modern-recruiters",
        description:
          "The top skills every recruiter needs to master in today's competitive hiring landscape.",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        readTime: "5 min",
        tag: "Skills",
      },
      {
        id: 2,
        heading: "How AI is Transforming the Recruitment Process",
        slug: "ai-transforming-recruitment",
        description:
          "How artificial intelligence is reshaping talent acquisition and candidate screening.",
        image:
          "https://images.unsplash.com/photo-1757889692998-d851b95f912e?auto=format&fit=crop&w=800&q=80",
        readTime: "7 min",
        tag: "Technology",
      },
      {
        id: 3,
        heading: "The Ultimate Guide to Employer Branding",
        slug: "ultimate-guide-employer-branding",
        description:
          "How to build a strong employer brand that attracts top talent to your organization.",
        image:
          "https://images.unsplash.com/photo-1740914994657-f1cdffdc418e?auto=format&fit=crop&w=800&q=80",
        readTime: "6 min",
        tag: "Branding",
      },
      {
        id: 4,
        heading: "Diversity Hiring: Strategies That Actually Work",
        slug: "diversity-hiring-strategies",
        description:
          "Proven methods to improve diversity and inclusion in your hiring practices.",
        image:
          "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=800&q=80",
        readTime: "4 min",
        tag: "DEI",
      },
      {
        id: 5,
        heading: "Remote Recruitment: Hiring Distributed Teams",
        slug: "remote-recruitment-best-practices",
        description:
          "Mastering the art of hiring remote employees with effective, tested strategies.",
        image:
          "https://images.unsplash.com/photo-1760463921956-b21cfa5cb2ac?auto=format&fit=crop&w=800&q=80",
        readTime: "5 min",
        tag: "Remote",
      },
      {
        id: 6,
        heading: "Candidate Experience: Turning Applicants into Advocates",
        slug: "candidate-experience-strategies",
        description:
          "How a positive candidate experience compounds into stronger employer brand.",
        image:
          "https://images.unsplash.com/photo-1760635165251-5a3a81425a89?auto=format&fit=crop&w=800&q=80",
        readTime: "6 min",
        tag: "Experience",
      },
      {
        id: 7,
        heading: "The Future of Work: Recruitment Trends to Watch",
        slug: "future-of-work-recruitment-trends",
        description:
          "Emerging trends in recruitment and talent acquisition worth planning around.",
        image:
          "https://images.unsplash.com/photo-1516199423456-1f1e91b06f25?auto=format&fit=crop&w=800&q=80",
        readTime: "8 min",
        tag: "Trends",
      },
      {
        id: 8,
        heading: "How to Write Job Descriptions That Attract Top Talent",
        slug: "writing-effective-job-descriptions",
        description:
          "Craft compelling job postings that stand out to qualified candidates.",
        image:
          "https://images.unsplash.com/photo-1653280662710-1cac52cde6d7?auto=format&fit=crop&w=800&q=80",
        readTime: "5 min",
        tag: "Writing",
      },
      {
        id: 9,
        heading: "Technical Recruitment: Finding the Right Developers",
        slug: "technical-recruitment-strategies",
        description:
          "Specialized approaches for identifying and hiring strong technical talent.",
        image:
          "https://images.unsplash.com/photo-1742281692582-3507d7219c33?auto=format&fit=crop&w=800&q=80",
        readTime: "7 min",
        tag: "Tech",
      },
      {
        id: 10,
        heading: "Metrics That Matter: Measuring Recruitment Success",
        slug: "recruitment-metrics-that-matter",
        description:
          "The key performance indicators worth tracking to optimize your hiring process.",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        readTime: "6 min",
        tag: "Analytics",
      },
    ],
    [],
  );

  const CARD_WIDTH = 260;
  const GAP = 22;
  const STEP = CARD_WIDTH + GAP;

  const sliderWrapRef = useRef(null);
  const cardRefs = useRef([]);
  const leftPanelContentRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const tagRef = useRef(null);
  const metaRef = useRef(null);
  const btnRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);

  const active = blogData[currentIndex];
  const activeColor = CATEGORY_COLORS[active.tag] || "#2632E0";

  const animateCards = (index, immediate = false) => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const diff = i - index;
      const abs = Math.abs(diff);

      let x = diff * STEP;
      let scale = 0.82;
      let opacity = 0.22;
      let rotateY = diff * -10;
      let y = 24;
      let zIndex = 1;
      let blur = 2;

      if (diff === 0) {
        x = 0;
        scale = 1;
        opacity = 1;
        rotateY = 0;
        y = -6;
        zIndex = 8;
        blur = 0;
      } else if (abs === 1) {
        scale = 0.9;
        opacity = 0.62;
        y = 8;
        zIndex = 6;
        blur = 0.6;
      } else if (abs === 2) {
        scale = 0.78;
        opacity = 0.28;
        y = 22;
        zIndex = 3;
        blur = 1.6;
      }

      gsap.to(card, {
        x,
        y,
        scale,
        opacity,
        rotateY,
        filter: `blur(${blur}px)`,
        duration: immediate ? 0 : 0.8,
        ease: "power3.out",
        overwrite: true,
      });

      card.style.zIndex = zIndex;
      card.style.pointerEvents = diff === 0 || abs === 1 ? "auto" : "none";
    });
  };

  const animateLeftContent = () => {
    const targets = [
      tagRef.current,
      titleRef.current,
      descRef.current,
      metaRef.current,
      btnRef.current,
    ].filter(Boolean);
    if (!targets.length) return;
    gsap.fromTo(
      targets,
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      gsap.set(cards, {
        position: "absolute",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      });

      if (leftPanelContentRef.current) {
        gsap.from(leftPanelContentRef.current, {
          x: -30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      }
      if (cards.length) {
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          scale: 0.9,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      animateCards(currentIndex, true);
      animateLeftContent();
    }, sliderWrapRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    animateCards(currentIndex);
    animateLeftContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    if (paused || dragging) return;
    const id = setInterval(() => goNext(), 3500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, dragging, currentIndex]);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % blogData.length);
  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + blogData.length) % blogData.length);
  const goToIndex = (idx) => setCurrentIndex(idx);

  useEffect(() => {
    const wrap = sliderWrapRef.current;
    if (!wrap) return;

    let startX = 0;
    let currentX = 0;
    let moved = false;

    const onPointerDown = (e) => {
      setDragging(true);
      setPaused(true);
      moved = false;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      currentX = startX;
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      if (Math.abs(currentX - startX) > 8) moved = true;
    };
    const onPointerUp = () => {
      if (!dragging) return;
      const diff = currentX - startX;
      if (moved && Math.abs(diff) > 50) {
        diff < 0 ? goNext() : goPrev();
      }
      setDragging(false);
      setTimeout(() => setPaused(false), 2600);
    };

    wrap.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      wrap.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging]);

  return (
    <section
      className="relative w-full overflow-hidden bg-primary-bg py-20 font-arimo lg:py-28"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(23,27,46,0.06) 1.5px, transparent 1.5px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="container relative z-10 mx-auto flex min-h-[560px] flex-col lg:flex-row">
        {/* LEFT — active post detail */}
        <div className="flex shrink-0 flex-col justify-center px-6 py-12 sm:px-10 lg:w-[38%] lg:px-14">
          <div ref={leftPanelContentRef}>
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em]"
              style={{
                backgroundColor: "rgba(38,50,224,0.08)",
                border: "1px solid rgba(38,50,224,0.22)",
                color: "#2632E0",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo shadow-[0_0_10px_rgba(38,50,224,0.7)]" />
              INSPIRING INSIGHTS
            </span>

            {/* <div
              ref={tagRef}
              className="mb-4 inline-block rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors duration-500"
              style={{
                color: activeColor,
                backgroundColor: `${activeColor}14`,
                border: `1px solid ${activeColor}3d`,
              }}
            >
              {active.tag}
            </div> */}

            <h2
              ref={titleRef}
              className="mb-3.5 text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.02em] text-black sm:text-[1.85rem]"
            >
              <a
                href={`/blogs/${active.slug}`}
                className="transition-colors duration-300 hover:text-brand-crimson"
              >
                {active.heading}
              </a>
            </h2>

            <p
              ref={descRef}
              className="mb-5 text-[14px] leading-[1.8] text-black/80"
            >
              {active.description}
            </p>

            <div
              ref={metaRef}
              className="mb-7 flex items-center gap-4 text-[12px] text-black/80"
            >
              <span className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3 w-3"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" strokeLinecap="round" />
                </svg>
                {active.readTime} read
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3 w-3"
                >
                  <path d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3V4z" />
                  <path d="M4 4v14" />
                </svg>
                Blog
              </span>
            </div>

            <div ref={btnRef}>
              <a
                href={`/blogs/${active.slug}`}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-tl-2xl rounded-br-2xl bg-ink px-7 py-3.5 text-[13px] font-semibold text-primary-bg transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="absolute inset-0 bg-[linear-gradient(120deg,#2632E0,#01C2FB,#027A68,#F8AF3C,#D50042)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10">Read Article →</span>
              </a>
            </div>

            <div className="mt-8 flex gap-2">
              {blogData.map((post, i) => (
                <button
                  key={post.id}
                  aria-label={`Show post ${i + 1}`}
                  onClick={() => goToIndex(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentIndex ? 26 : 6,
                    backgroundColor:
                      i === currentIndex ? activeColor : "rgba(23,27,46,0.15)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — 3D coverflow stack */}
        <div className="relative flex-1">
          <div className="absolute right-2 top-3 z-20 flex gap-2.5 sm:right-6">
            <button
              onClick={goPrev}
              aria-label="Previous post"
              className="flex h-11 w-11 items-center justify-center rounded-tl-2xl rounded-br-2xl border border-ink/12 bg-primary-bg/90 text-ink shadow-[0_10px_22px_-8px_rgba(23,27,46,0.2)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-indigo/40 hover:text-brand-indigo"
            >
              ←
            </button>
            <button
              onClick={goNext}
              aria-label="Next post"
              className="flex h-11 w-11 items-center justify-center rounded-tl-2xl rounded-br-2xl border border-ink/12 bg-primary-bg/90 text-ink shadow-[0_10px_22px_-8px_rgba(23,27,46,0.2)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-indigo/40 hover:text-brand-indigo"
            >
              →
            </button>
          </div>

          <div
            ref={sliderWrapRef}
            className="relative h-full min-h-[540px] w-full cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => !dragging && setPaused(false)}
          >
            {blogData.map((post, i) => {
              const color = CATEGORY_COLORS[post.tag] || "#2632E0";
              return (
                <div
                  key={post.id}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="h-[360px] w-[260px] cursor-pointer select-none overflow-hidden rounded-[1.6rem] shadow-[0_20px_44px_-18px_rgba(23,27,46,0.4)] will-change-transform sm:h-[380px] sm:w-[260px]"
                >
                  <div className="relative h-full w-full">
                    <img
                      src={post.image}
                      alt={post.heading}
                      draggable="false"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/25 to-transparent" />

                    <span
                      className="absolute left-3.5 top-3.5 rounded-lg px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white"
                      style={{ backgroundColor: color }}
                    >
                      {post.tag}
                    </span>

                    <div className="absolute inset-x-4 bottom-4">
                      <p className="mb-1.5 text-[14.5px] font-bold leading-snug text-white">
                        {post.heading}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-white/65">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-2.5 w-2.5"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 3" strokeLinecap="round" />
                        </svg>
                        {post.readTime} read
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {paused && (
            <div className="absolute bottom-5 right-6 z-20 rounded-tl-2xl rounded-br-2xl border border-ink/10 bg-ink/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-bg/70 backdrop-blur">
              Paused
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InsightsCarousel;
