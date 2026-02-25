"use client";

import { useEffect, useRef } from "react";

export function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const beam = beamRef.current;
    if (!track || !beam) return;

    const onScroll = () => {
      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(y / max, 1) : 0;
      beam.style.height = `${progress.current * 100}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={trackRef}
      className="pointer-events-none fixed right-0 top-0 z-9998 h-screen w-1 rounded-full bg-foreground/6"
    >
      <div
        ref={beamRef}
        className="relative w-full rounded-full bg-linear-to-b from-transparent via-violet-500/80 to-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
        style={{ height: "0%" }}
      />
    </div>
  );
}
