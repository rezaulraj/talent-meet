import React, { useEffect, useRef } from "react";

const INK = "#171B2E";
const INDIGO = "#2632E0";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const HiringGuideCharacter = ({ lean = 0, active = false }) => {
  const canvasRef = useRef(null);
  const leanTargetRef = useRef(lean);
  const activeRef = useRef(active);

  useEffect(() => {
    leanTargetRef.current = lean;
  }, [lean]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, dpr, raf;
    const start = performance.now();

    let currentLean = 0;
    let nextBlinkAt = 1.5 + Math.random() * 2;
    let blinkUntil = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame(now) {
      const t = (now - start) / 1000;
      currentLean = lerp(currentLean, leanTargetRef.current, 0.07);

      if (t > nextBlinkAt) {
        blinkUntil = t + 0.12;
        nextBlinkAt = t + 2.5 + Math.random() * 2.5;
      }
      const blinking = t < blinkUntil;

      const breathe = 1 + Math.sin(t * 1.15) * 0.015;
      const sway = Math.sin(t * 0.6) * 0.04;
      const totalLean = currentLean * 0.55 + sway;

      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const groundY = H * 0.92;
      const headR = W * 0.16;
      const bodyTopY = H * 0.42;
      const bodyH = groundY - bodyTopY - 14;

      ctx.save();
      ctx.translate(cx, groundY);
      ctx.rotate(totalLean * 0.12);
      ctx.translate(-cx, -groundY);

      // legs
      ctx.strokeStyle = INK;
      ctx.lineWidth = W * 0.055;
      ctx.lineCap = "round";
      [-1, 1].forEach((side) => {
        ctx.beginPath();
        ctx.moveTo(cx + side * W * 0.06, bodyTopY + bodyH);
        ctx.lineTo(cx + side * (W * 0.09 + totalLean * 3), groundY);
        ctx.stroke();
      });

      // resting arm (side opposite the lean)
      const restSide = currentLean >= 0 ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + restSide * W * 0.15, bodyTopY + 10);
      ctx.lineTo(cx + restSide * (W * 0.2), bodyTopY + bodyH * 0.55);
      ctx.stroke();

      // pointing arm (side toward the lean), lifts with |lean| and when active
      const pointSide = currentLean >= 0 ? 1 : -1;
      const liftAmount = Math.min(
        1,
        Math.abs(currentLean) * (active ? 1.3 : 0.5),
      );
      const shoulderX = cx + pointSide * W * 0.15;
      const shoulderY = bodyTopY + 10;
      const armAngle = pointSide * (0.35 + liftAmount * 1.15); // radians from vertical
      const armLen = W * 0.34;
      const elbowX = shoulderX + Math.sin(armAngle) * armLen * 0.55;
      const elbowY = shoulderY + Math.cos(armAngle) * armLen * 0.55;
      const handX = shoulderX + Math.sin(armAngle) * armLen;
      const handY = shoulderY + Math.cos(armAngle) * armLen * 0.85;
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.quadraticCurveTo(elbowX, elbowY, handX, handY);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(handX, handY, W * 0.02, 0, Math.PI * 2);
      ctx.fillStyle = INK;
      ctx.fill();

      // torso
      const bodyW = W * 0.34 * breathe;
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(cx - bodyW / 2, bodyTopY, bodyW, bodyH, bodyW / 2.4)
        : ctx.rect(cx - bodyW / 2, bodyTopY, bodyW, bodyH);
      ctx.fill();

      // lanyard + ID badge — the one accent color, a nod to the industry
      ctx.strokeStyle = INDIGO;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - bodyW * 0.18, bodyTopY + 2);
      ctx.lineTo(cx, bodyTopY + bodyH * 0.32);
      ctx.moveTo(cx + bodyW * 0.18, bodyTopY + 2);
      ctx.lineTo(cx, bodyTopY + bodyH * 0.32);
      ctx.stroke();
      const badgeW = bodyW * 0.34,
        badgeH = badgeW * 1.2;
      ctx.fillStyle = INDIGO;
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(
            cx - badgeW / 2,
            bodyTopY + bodyH * 0.32,
            badgeW,
            badgeH,
            3,
          )
        : ctx.rect(cx - badgeW / 2, bodyTopY + bodyH * 0.32, badgeW, badgeH);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(
        cx - badgeW / 2 + 2,
        bodyTopY + bodyH * 0.32 + 2,
        badgeW - 4,
        badgeH * 0.4,
      );

      ctx.restore();

      // head (drawn after restore so it stays levelled, only nods slightly)
      const headCx = cx + totalLean * W * 0.05;
      const headCy = bodyTopY - headR * 0.65;

      ctx.save();
      ctx.translate(headCx, headCy);
      ctx.rotate(totalLean * 0.15);
      ctx.beginPath();
      ctx.arc(0, 0, headR * breathe, 0, Math.PI * 2);
      ctx.fillStyle = INK;
      ctx.fill();

      // eyes
      const eyeOffsetX = headR * 0.32;
      const eyeY = -headR * 0.05;
      const pupilShift = currentLean * headR * 0.18;
      [-1, 1].forEach((side) => {
        ctx.beginPath();
        ctx.ellipse(
          side * eyeOffsetX,
          eyeY,
          headR * 0.14,
          blinking ? 0.6 : headR * 0.16,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#FFFEF9";
        ctx.fill();
        if (!blinking) {
          ctx.beginPath();
          ctx.arc(
            side * eyeOffsetX + pupilShift,
            eyeY,
            headR * 0.07,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = INK;
          ctx.fill();
        }
      });

      // smile
      ctx.beginPath();
      ctx.arc(0, headR * 0.25, headR * 0.32, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = "#FFFEF9";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};

export default HiringGuideCharacter;
