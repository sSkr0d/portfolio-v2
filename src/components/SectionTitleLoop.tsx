"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import type { SectionTitleConfig } from "@/lib/content/section-titles";
import { cn } from "@/lib/utils";

const REPEAT_COUNT = 24;
const SPEED = 0.9;

interface SectionTitleLoopProps {
  config: SectionTitleConfig;
  className?: string;
}

export function SectionTitleLoop({ config, className }: SectionTitleLoopProps) {
  const { title, Icon, iconColor, iconBgClass } = config;
  const innerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [segmentWidth, setSegmentWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const velRef = useRef(0);
  const dirRef = useRef<-1 | 1>(-1);

  const segment = (
    <span className="inline-flex items-center gap-6 mr-6">
      <span className="whitespace-nowrap">{title}</span>
      <span
        className={cn(
          "relative z-20 flex shrink-0 items-center justify-center rounded-2xl",
          "h-6 w-16 p-1.5 md:h-12 md:w-32 md:p-3",
          iconBgClass
        )}
        aria-hidden
      >
        <span className="md:hidden">
          <Icon size={24} color={iconColor} weight="duotone" />
        </span>
        <span className="hidden md:block">
          <Icon size={42} color={iconColor} weight="duotone" />
        </span>
      </span>
    </span>
  );

  const segments = Array.from({ length: REPEAT_COUNT }, (_, i) => (
    <span key={i}>
      {segment}
    </span>
  ));

  const content = (
    <>
      <span className="flex shrink-0 items-center" data-half>
        {segments}
      </span>
      <span className="flex shrink-0 items-center" data-half>
        {segments}
      </span>
    </>
  );

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const firstHalf = el.querySelector("[data-half]") as HTMLElement | null;
    if (firstHalf) {
      const w = firstHalf.offsetWidth;
      setSegmentWidth(w);
      setOffset(-w);
    }
  }, [title, config]);

  useEffect(() => {
    if (segmentWidth <= 0) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current) {
        setOffset((prev) => {
          const next = prev + dirRef.current * SPEED;
          if (next <= -segmentWidth) return next + segmentWidth;
          if (next > 0) return next - segmentWidth;
          return next;
        });
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [segmentWidth]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = true;
    setIsDragging(true);
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [offset]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || segmentWidth <= 0) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    setOffset((prev) => {
      let next = prev + dx;
      if (next <= -segmentWidth) next += segmentWidth;
      if (next > 0) next -= segmentWidth;
      return next;
    });
  }, [segmentWidth]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragRef.current = false;
    setIsDragging(false);
    dirRef.current = velRef.current > 0 ? 1 : -1;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div
      className={cn("overflow-hidden py-4", className)}
      style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "auto",
        marginLeft: "-50vw",
      }}
      aria-hidden
    >
      <div
        ref={innerRef}
        className="flex w-max select-none items-center text-[clamp(1.5rem,5vw,3rem)] font-bold uppercase leading-none tracking-tight text-foreground"
        style={{
          transform: `translateX(${offset}px)`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => onPointerUp(e)}
        onPointerLeave={(e) => onPointerUp(e)}
      >
        {content}
      </div>
    </div>
  );
}
