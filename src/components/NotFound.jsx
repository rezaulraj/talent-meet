import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const NotFound = () => {
  const pageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".notfound-word", {
        y: 70,
        opacity: 0,
        rotateX: 70,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
      });

      gsap.from(".notfound-reveal", {
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.35,
        ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="font-arimo relative min-h-screen overflow-hidden py-20"
    >
      <div className="absolute left-0 top-0 h-full w-full bg-[var(--color-primary-bg)]" />

      <section className="relative z-20 flex min-h-screen items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold tracking-[-0.06em] text-black sm:text-8xl lg:text-[120px]">
            {["Launching", "Soon"].map((word, index) => (
              <span key={index} className="inline-block overflow-hidden px-3">
                <span className="notfound-word inline-block">{word}</span>
              </span>
            ))}
          </h1>

          <h2 className="notfound-reveal mt-6 text-3xl font-normal tracking-[-0.04em] text-black sm:text-5xl">
            We're building something great Stay tuned.
          </h2>

          <p className="notfound-reveal mx-auto mt-6 max-w-2xl text-lg leading-8 text-black/70">
            This section is currently under development and will be available
            soon. We're working hard to bring you valuable information,
            resources and services. Please check back later.
          </p>

          <div className="notfound-reveal mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="group relative overflow-hidden rounded-full bg-black px-7 py-3 text-sm font-bold text-white"
            >
              <span className="absolute inset-0 w-0 bg-yellow-400 transition-all duration-700 ease-out group-hover:w-full" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                Back to Home
              </span>
            </a>

            <a
              href="/contact"
              className="rounded-full border border-black px-7 py-3 text-sm font-bold text-black transition-all duration-300 hover:bg-black hover:text-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
