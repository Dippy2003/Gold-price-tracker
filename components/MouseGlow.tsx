"use client";

import { useEffect, useRef } from "react";

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let rafId: number;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    // Smooth lerp follow
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function animate() {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);

      el!.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px)`;
      rafId = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 600,
        height: 600,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 1,
        background:
          "radial-gradient(circle at center, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.04) 35%, transparent 65%)",
        filter: "blur(2px)",
        willChange: "transform",
        mixBlendMode: "screen",
      }}
    />
  );
}
