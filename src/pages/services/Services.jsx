import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BLACK = "#000000";
const RED = "#D50042";
const BRAND = "Talent Grid";

const PENTAGON_CLIP = "polygon(16% 0%, 100% 0%, 100% 100%, 16% 100%, 0% 50%)";

const RAIL_WIDTH = 84;

const STAGES = [
  {
    label: "Stage 01",
    title: "Source",
    description:
      "We find the people — locally or overseas — before you're short-staffed, not after. Sourcing runs continuously in the background, so when a role opens up, we're not starting from zero.",
  },
  {
    label: "Stage 02",
    title: "Qualify & Deploy",
    description:
      "We prove they can do the job, then place them exactly where your business needs them — screened, tested, and matched to the role, not just available on a given week.",
  },
  {
    label: "Stage 03",
    title: "Settle",
    description:
      "The part most agencies skip — getting people paid, legal, and settled once they've started, so a hire that took months to make doesn't fall apart in week three over a missing document.",
  },
];

const SERVICES = [
  {
    code: "01",
    stage: 0,
    tag: "Pipeline",
    title: "Workforce Sourcing",
    blurb:
      "We map talent pools across trades, industries, and borders so a pipeline already exists by the time you need to hire. It's the difference between calling around in a panic and picking up the phone.",
    img: "https://images.unsplash.com/photo-1653280662710-1cac52cde6d7",
  },
  {
    code: "02",
    stage: 0,
    tag: "International",
    title: "Overseas Recruitment",
    blurb:
      "End-to-end hiring across international markets — job posting, interviews, offer, and the paperwork that gets someone from another country to your gate, coordinated by one team the whole way.",
    img: "https://images.unsplash.com/photo-1530469525856-cf37954301f7",
  },
  {
    code: "03",
    stage: 0,
    tag: "Leadership",
    title: "Executive Search",
    blurb:
      "Confidential search for leadership and specialist roles, where a bad hire costs a year and the right one changes the trajectory of the business. We work slower and dig deeper on these.",
    img: "https://images.unsplash.com/photo-1758518731694-41ea7fa6a2d9",
  },
  {
    code: "04",
    stage: 1,
    tag: "Vetting",
    title: "Candidate Screening",
    blurb:
      "Background checks, reference calls, and identity verification before anyone reaches your desk. If something doesn't check out, you never hear about that candidate at all.",
    img: "https://images.unsplash.com/photo-1758520144427-ddb02ac74e9d",
  },
  {
    code: "05",
    stage: 1,
    tag: "Verified skill",
    title: "Trade Testing & Assessment",
    blurb:
      "Hands-on trade tests confirm a candidate can actually do the job they claim on paper — welding, machinery, technical trades, whatever the role calls for, tested before day one, not discovered on it.",
    img: "https://images.unsplash.com/photo-1745448797901-2a4c9d9af1c1",
  },
  {
    code: "06",
    stage: 1,
    tag: "Volume",
    title: "Bulk Hiring",
    blurb:
      "Hundreds of roles filled on a fixed schedule, without cutting corners on screening or compliance. Volume hiring done fast usually means volume hiring done badly — we built our process not to trade one for the other.",
    img: "https://images.unsplash.com/photo-1741591647611-765ae3019a0f",
  },
  {
    code: "07",
    stage: 1,
    tag: "Long-term",
    title: "Permanent Staffing",
    blurb:
      "Long-term hires matched on skill, culture, and career trajectory, not just a resume that fits the job description. We're aiming for people who are still there in three years.",
    img: "https://images.unsplash.com/photo-1758518731706-be5d5230e5a5",
  },
  {
    code: "08",
    stage: 1,
    tag: "Flexible",
    title: "Temporary Staffing",
    blurb:
      "Flexible crews ready for seasonal peaks, project surges, and gaps that show up with a week's notice. Scale a team up or down without the overhead of a permanent headcount.",
    img: "https://images.unsplash.com/photo-1751054720514-067105f538d4",
  },
  {
    code: "09",
    stage: 1,
    tag: "RPO",
    title: "Recruitment Process Outsourcing",
    blurb:
      "We run your hiring function end to end — sourcing, screening, offers, reporting — so your internal team can focus on the work in front of them instead of the workload behind it.",
    img: "https://images.unsplash.com/photo-1748609160056-7b95f30041f0",
  },
  {
    code: "10",
    stage: 2,
    tag: "Compliance",
    title: "Payroll & HR Solutions",
    blurb:
      "Payroll, statutory compliance, and HR admin handled accurately, on time, every single cycle — for a team of ten or a workforce of ten thousand across multiple countries.",
    img: "https://images.unsplash.com/photo-1763729805496-b5dbf7f00c79",
  },
  {
    code: "11",
    stage: 2,
    tag: "Paperwork",
    title: "Visa & Documentation Support",
    blurb:
      "Visa applications, work permits, and every supporting document managed start to finish, with deadlines tracked so a hire never gets stuck in a queue you didn't know existed.",
    img: "https://images.unsplash.com/photo-1747115084263-afbe6739b7ba",
  },
  {
    code: "12",
    stage: 2,
    tag: "Landing",
    title: "Relocation & Onboarding",
    blurb:
      "From the flight to the first day, we handle housing, orientation, and settling in — then keep checking in until the hire is actually part of the team, not just present on payroll.",
    img: "https://images.unsplash.com/photo-1586441133374-ed1cb4007a47",
  },
];

const STATS = [
  { value: "40+", label: "Countries deployed to" },
  { value: "15,000+", label: "Placements made" },
  { value: "98%", label: "Visa approval rate" },
  { value: "12", label: "Services, one partner" },
];

const Services = () => {
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const canvasRef = useRef(null);
  const rowRefs = useRef([]);
  const nodesRef = useRef([]);
  const progressRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const canvas = canvasRef.current;
    const ctx2d = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const pathPointsRef = { current: [] };

    function ease(t) {
      return 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
    }

    function xAt(nodes, y, leftX, rightX) {
      if (nodes.length === 0) return (leftX + rightX) / 2;
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
      const listH = listRef.current.offsetHeight;
      canvas.width = RAIL_WIDTH * dpr;
      canvas.height = listH * dpr;
      canvas.style.width = `${RAIL_WIDTH}px`;
      canvas.style.height = `${listH}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

      const leftX = RAIL_WIDTH * 0.3;
      const rightX = RAIL_WIDTH * 0.7;

      nodesRef.current = rowRefs.current.map((row, i) => ({
        y: row.offsetTop + row.offsetHeight / 2,
        x: i % 2 === 0 ? leftX : rightX,
      }));

      const points = [];
      for (let y = 0; y <= listH; y += 3) {
        points.push({ x: xAt(nodesRef.current, y, leftX, rightX), y });
      }
      pathPointsRef.current = points;
    }

    function strokePath(points, color, width) {
      if (points.length < 2) return;
      ctx2d.strokeStyle = color;
      ctx2d.lineWidth = width;
      ctx2d.lineJoin = "round";
      ctx2d.lineCap = "round";
      ctx2d.beginPath();
      ctx2d.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++)
        ctx2d.lineTo(points[i].x, points[i].y);
      ctx2d.stroke();
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

    function draw() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const progressY = progressRef.current * h;
      const points = pathPointsRef.current;

      ctx2d.clearRect(0, 0, w, h);

      strokePath(points, "rgba(0,0,0,0.12)", 2);
      strokePath(
        points.filter((p) => p.y <= progressY),
        RED,
        2.5,
      );

      nodesRef.current.forEach((node, i) => {
        const passed = node.y <= progressY;
        ctx2d.beginPath();
        ctx2d.arc(node.x, node.y, 7, 0, Math.PI * 2);
        ctx2d.fillStyle = passed ? RED : "#ffffff";
        ctx2d.fill();
        ctx2d.lineWidth = 2;
        ctx2d.strokeStyle = passed ? RED : "rgba(0,0,0,0.35)";
        ctx2d.stroke();

        ctx2d.fillStyle = passed ? "#ffffff" : "rgba(0,0,0,0.55)";
        ctx2d.font = "600 8px Arimo, sans-serif";
        ctx2d.textAlign = "center";
        ctx2d.textBaseline = "middle";
        ctx2d.fillText(String(i + 1).padStart(2, "0"), node.x, node.y + 0.5);
      });

      const head = pointAtY(points, progressY);
      for (let i = 5; i >= 1; i--) {
        const trailPoint = pointAtY(points, progressY - i * 6);
        ctx2d.beginPath();
        ctx2d.arc(trailPoint.x, trailPoint.y, 3.5 - i * 0.4, 0, Math.PI * 2);
        ctx2d.fillStyle = `rgba(213,0,66,${0.08 * (6 - i)})`;
        ctx2d.fill();
      }

      if (progressY > 0 && progressY < h) {
        ctx2d.save();
        ctx2d.shadowColor = "rgba(213,0,66,0.65)";
        ctx2d.shadowBlur = 12;
        ctx2d.beginPath();
        ctx2d.arc(head.x, head.y, 8, 0, Math.PI * 2);
        ctx2d.fillStyle = RED;
        ctx2d.fill();
        ctx2d.restore();
      }
    }

    measure();
    draw();

    const onResize = () => {
      measure();
      draw();
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
            ".hero-statbar",
            ".hero-stat",
            ".hero-media",
            ".stage-header",
            ".svc-row",
            ".cta-reveal",
          ],
          { opacity: 1, clearProps: "all" },
        );
        progressRef.current = 1;
        draw();
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
        .from(".hero-statbar", { y: 24, opacity: 0, duration: 0.6 }, "-=0.2")
        .from(
          ".hero-stat",
          { y: 12, opacity: 0, duration: 0.4, stagger: 0.06 },
          "-=0.3",
        )
        .from(
          ".hero-media",
          { xPercent: 12, opacity: 0, duration: 1.1, ease: "power3.out" },
          0.05,
        )
        .from(
          ".hero-media img",
          { scale: 1.18, duration: 1.6, ease: "power2.out" },
          0.05,
        );

      gsap.utils.toArray(".stage-header").forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      ScrollTrigger.create({
        trigger: listRef.current,
        start: "top 65%",
        end: "bottom 45%",
        scrub: 0.5,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          draw();
        },
      });

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const media = row.querySelector(".svc-media");
        const parallaxImg = row.querySelector(".svc-parallax-img");
        const text = row.querySelector(".svc-text");
        const tagEl = row.querySelector(".svc-tag");
        const codeEl = row.querySelector(".svc-code");
        const imageFirst = i % 2 === 0;

        gsap.set(media, { x: imageFirst ? -36 : 36, opacity: 0 });
        gsap.set(text, { x: imageFirst ? 36 : -36, opacity: 0 });
        gsap.set(row, { transformOrigin: "center center" });

        const focusTl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            end: "bottom 20%",
            scrub: 0.6,
          },
        });

        focusTl
          .to(
            row,
            { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
            0,
          )
          .to(media, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
          .to(text, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
          .to(tagEl, { color: RED, duration: 0.4 }, 0.15)
          .to(codeEl, { color: RED, opacity: 1, duration: 0.4 }, 0.15)
          .to(
            row,
            { scale: 0.96, opacity: 0.55, duration: 0.5, ease: "power2.in" },
            0.7,
          )
          .to(tagEl, { color: BLACK, duration: 0.4 }, 0.7)
          .to(codeEl, { color: BLACK, opacity: 0.25, duration: 0.4 }, 0.7);

        if (parallaxImg) {
          gsap.fromTo(
            parallaxImg,
            { yPercent: -14 },
            {
              yPercent: 14,
              ease: "none",
              scrollTrigger: {
                trigger: media,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

      gsap.from(".cta-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".cta-reveal", start: "top 85%" },
      });
    }, rootRef);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="bg-white font-arimo text-black">
      <section className="relative min-h-screen overflow-hidden bg-[#FFFEF9] py-10">
        <div className="relative h-64 w-full md:hidden">
          <img
            src="https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=1200&q=80"
            alt="Traveller walking through an airport terminal at dusk"
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-black/10" />
        </div>

        <div
          className="hero-media absolute inset-y-0 right-0 z-0 hidden w-1/2 md:block"
          style={{ clipPath: PENTAGON_CLIP }}
        >
          <img
            src="https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=1600&q=80"
            alt="Traveller walking through an airport terminal at dusk"
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div
            className="absolute inset-0"
            style={{ boxShadow: "inset 0 0 0 9999px rgba(213,0,66,0.04)" }}
          />
        </div>

        <div className="absolute left-6 top-6 z-20 flex items-center gap-2.5 sm:left-10 sm:top-8">
          <span
            className="block h-5 w-5"
            style={{ backgroundColor: RED, clipPath: PENTAGON_CLIP }}
            aria-hidden="true"
          />
          <span className="text-[15px] font-bold uppercase tracking-[0.08em] text-white">
            {BRAND}
          </span>
        </div>

        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl pb-28 md:grid-cols-2 md:pb-32">
          <div className="flex flex-col justify-center px-6 py-16 sm:px-10 md:py-24 lg:px-16">
            <div className="hero-eyebrow mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-ink backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: RED }}
              />
              A top-notch recruitment agency
            </div>

            <h1 className="max-w-xl text-[40px] font-bold leading-[1.1] text-ink sm:text-[52px] lg:text-[58px]">
              <span className="block overflow-hidden">
                <span className="hero-line block">Comprehensive hiring.</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block">
                  One <span style={{ color: RED }}>top-notch</span>
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block">agency behind it.</span>
              </span>
            </h1>

            <p className="hero-sub mt-6 max-w-md text-[16px] leading-relaxed text-ink/80">
              Most agencies hand you off between sourcing, compliance, and
              relocation teams who've never spoken to each other. Talent Grid is
              built differently — the same people who source a candidate are
              still on the case when they land, sign, and start. Comprehensive
              coverage, one point of contact, no handoffs.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#services"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-tl-2xl rounded-br-2xl bg-black px-8 py-4 text-[14.5px] font-semibold text-primary-bg transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                style={{ backgroundColor: RED }}
              >
                <span className="absolute inset-0 bg-[linear-gradient(120deg,#000000,#000008,#D50042)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10">View our services</span>
              </a>
              <a
                href="/employers/request-employees"
                className="inline-flex items-center rounded-tl-2xl rounded-br-2xl border-[1.5px] border-ink/15 px-8 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:-translate-y-1 hover:border-ink/35 hover:bg-ink/[0.03]"
              >
                Talk To Our Team
              </a>
            </div>
          </div>

          {/* Spacer column reserving grid space for the absolutely
              positioned pentagon image on desktop */}
          <div className="hidden md:block" />
        </div>

        {/* Stat bar — pinned across the FULL width of the hero, so it
            physically overlaps both the black half and the image half
            instead of living inside just one column. */}
        <div className="hero-statbar absolute inset-x-0 bottom-0 z-20 border-t border-white/15 bg-black/55 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-6 py-7 sm:px-10 sm:py-8 md:grid-cols-4 lg:px-16">
            {STATS.map((s) => (
              <div key={s.label} className="hero-stat">
                <div className="text-2xl font-bold text-white sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section
        id="services"
        className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
      >
        <div className="mx-auto mb-20 max-w-2xl text-center sm:mb-24">
          <span
            className="mb-4 inline-flex items-center gap-2.5 text-[12.5px] font-bold uppercase tracking-[0.2em]"
            style={{ color: RED }}
          >
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: RED }}
            />
            Every stage, covered
          </span>
          <h2 className="text-[32px] font-bold leading-tight text-black sm:text-[42px]">
            Comprehensive services. One case winding through them.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-black/60">
            We built comprehensive coverage around the order a placement
            actually unfolds in, not a menu of add-ons. The path on the right is
            that placement moving through the process — scroll to follow it from
            the first sourcing call to the day someone actually starts, and
            watch each photo drift as the case winds past it.
          </p>
        </div>

        <div ref={listRef} className="relative md:pr-24">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden md:block"
            style={{ width: RAIL_WIDTH }}
          >
            <canvas ref={canvasRef} className="block" />
          </div>

          <div className="flex flex-col gap-20 sm:gap-24">
            {STAGES.map((stage, stageIdx) => (
              <div key={stage.title}>
                <div className="stage-header mb-10 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <span className="h-px w-10 bg-black/15" />
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: RED }}
                    >
                      {stage.label}
                    </span>
                    <span className="h-px w-10 bg-black/15" />
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-black sm:text-3xl">
                    {stage.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-lg text-[14.5px] leading-relaxed text-black/55">
                    {stage.description}
                  </p>
                </div>

                <div className="flex flex-col gap-16 sm:gap-20">
                  {SERVICES.filter((s) => s.stage === stageIdx).map(
                    (service) => {
                      const globalIndex = SERVICES.findIndex(
                        (s) => s.code === service.code,
                      );
                      const imageFirst = globalIndex % 2 === 0;
                      return (
                        <div
                          key={service.code}
                          ref={(el) => (rowRefs.current[globalIndex] = el)}
                          className="svc-row grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12"
                        >
                          {/* Media — parallax frame */}
                          <div
                            className={`svc-media relative aspect-[4/3] overflow-hidden rounded-2xl ${
                              imageFirst ? "md:order-1" : "md:order-2"
                            }`}
                          >
                            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                              <img
                                src={`${service.img}?auto=format&fit=crop&w=900&q=80`}
                                alt=""
                                loading="lazy"
                                className="svc-parallax-img absolute inset-x-0 h-[140%] w-full object-cover grayscale transition-[filter] duration-700 ease-out hover:grayscale-0"
                                style={{ top: "-20%" }}
                              />
                            </div>
                            <div
                              className="absolute left-4 top-4 h-10 w-10 rounded-full border-2 bg-white"
                              style={{ borderColor: "rgba(0,0,0,0.15)" }}
                            />
                          </div>

                          {/* Text */}
                          <div
                            className={`svc-text flex flex-col justify-center ${
                              imageFirst ? "md:order-2" : "md:order-1"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
                              <span className="svc-tag text-black transition-colors">
                                {service.tag}
                              </span>
                              <span className="text-black/25">•</span>
                              <span className="svc-code text-black/25 opacity-100 transition-colors">
                                SVC—{service.code}
                              </span>
                            </div>
                            <h3 className="mt-2 text-[22px] font-bold leading-tight text-black sm:text-[24px]">
                              {service.title}
                            </h3>
                            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-black/60">
                              {service.blurb}
                            </p>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative overflow-hidden bg-white px-6 py-24 sm:px-10 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 opacity-[0.04]"
          style={{ backgroundColor: BLACK, clipPath: PENTAGON_CLIP }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div
            className="cta-reveal mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: RED }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: RED }}
            />
            Ready when you are
          </div>
          <h2 className="cta-reveal text-[32px] font-bold leading-tight text-black sm:text-[42px]">
            Tell a top-notch recruitment agency what your workforce needs.
          </h2>
          <p className="cta-reveal mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-black/60">
            One conversation gets you sourcing, screening, compliance, and
            relocation — coordinated by a single team, start to finish, from the
            brief to the first day on the job.
          </p>
          <div className="cta-reveal mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-tl-2xl rounded-br-2xl bg-black px-8 py-4 text-[14.5px] font-semibold text-primary-bg transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
              style={{ backgroundColor: BLACK }}
            >
              <span className="absolute inset-0 bg-[linear-gradient(120deg,#000000,#000008,#D50042)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative z-10">Start the conversation</span>
            </a>
            <a
              href="#services"
              className="inline-flex items-center rounded-tl-2xl rounded-br-2xl border-[1.5px] border-ink/15 px-8 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:-translate-y-1 hover:border-ink/35 hover:bg-ink/[0.03]"
            >
              Review the manifest
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
