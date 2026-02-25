"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface AnimatedCardRevealProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

function CardBackFace() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br from-slate-900 via-indigo-950 to-violet-950 p-3 shadow-xl">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-white/10">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px)",
          }}
        />
        <div className="relative flex flex-col items-center gap-4">
          <div className="absolute -inset-10 rounded-full bg-linear-to-r from-indigo-500/20 to-purple-500/20 blur-2xl" />
          <div className="relative">
            <div className="absolute -inset-4 animate-pulse rounded-full bg-linear-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/15 bg-linear-to-br from-indigo-500 via-purple-500 to-violet-600 shadow-2xl shadow-purple-500/25">
              <span className="select-none text-3xl">⚡</span>
            </div>
          </div>
          <div className="h-px w-28 bg-linear-to-r from-transparent via-white/25 to-transparent" />
          <p className="select-none text-[10px] font-semibold uppercase tracking-[0.35em] text-white/30">
            Developer Card
          </p>
        </div>
        <div className="absolute left-2.5 top-2.5 h-5 w-5 rounded-tl-md border-l border-t border-white/10" />
        <div className="absolute right-2.5 top-2.5 h-5 w-5 rounded-tr-md border-r border-t border-white/10" />
        <div className="absolute bottom-2.5 left-2.5 h-5 w-5 rounded-bl-md border-b border-l border-white/10" />
        <div className="absolute bottom-2.5 right-2.5 h-5 w-5 rounded-br-md border-b border-r border-white/10" />
      </div>
    </div>
  );
}

export function AnimatedCardReveal({
  children,
  onComplete,
}: AnimatedCardRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [animDone, setAnimDone] = useState(false);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const wrapper = wrapperRef.current;
    const flipper = flipperRef.current;
    const placeholder = placeholderRef.current;
    if (!wrapper || !flipper || !placeholder) return;

    const naturalRect = wrapper.getBoundingClientRect();

    placeholder.style.width = `${naturalRect.width}px`;
    placeholder.style.height = `${naturalRect.height}px`;
    placeholder.style.display = "block";

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    gsap.set(wrapper, {
      position: "fixed",
      top: 0,
      left: 0,
      x: (window.innerWidth - naturalRect.width) / 2,
      y: (window.innerHeight - naturalRect.height) / 2,
      zIndex: 50,
      width: naturalRect.width,
      opacity: 1,
      pointerEvents: "none",
    });

    gsap.set(flipper, { rotateY: 180 });

    const destRect = placeholder.getBoundingClientRect();

    const tl = gsap.timeline({ delay: 0.4 });
    tlRef.current = tl;

    tl.to(flipper, {
      rotateY: 0,
      duration: 1,
      ease: "power2.inOut",
    });

    tl.to(
      wrapper,
      {
        x: destRect.left,
        y: destRect.top,
        duration: 0.8,
        ease: "power3.inOut",
      },
      "+=0.2",
    );

    tl.call(() => {
      gsap.set(wrapper, { clearProps: "all" });
      gsap.set(flipper, { clearProps: "all" });
      placeholder.style.display = "none";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      setAnimDone(true);
      onCompleteRef.current?.();
    });

    const handleResize = () => {
      if (tlRef.current?.isActive()) {
        tlRef.current.progress(1).kill();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      tl.kill();
      if (wrapper) gsap.set(wrapper, { clearProps: "all" });
      if (flipper) gsap.set(flipper, { clearProps: "all" });
      if (placeholder) placeholder.style.display = "none";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div
        ref={placeholderRef}
        style={{ display: "none" }}
        aria-hidden="true"
      />
      <div
        ref={wrapperRef}
        className={animDone ? undefined : "opacity-0"}
        style={animDone ? undefined : { perspective: "1200px" }}
      >
        <div
          ref={flipperRef}
          style={
            animDone
              ? undefined
              : { transformStyle: "preserve-3d", position: "relative" }
          }
        >
          <div
            style={animDone ? undefined : { backfaceVisibility: "hidden" }}
          >
            {children}
          </div>
          {!animDone && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardBackFace />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
