import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";

const SmoothScroll = () => {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (lenisRef.current) return; // guard against double-mount

    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      autoRaf: false, // 👈 critical: prevents double raf loop with gsap.ticker
    });
    lenisRef.current = lenis;

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [location.pathname]);

  return null;
};

export default SmoothScroll;
