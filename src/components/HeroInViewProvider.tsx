"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface HeroInViewContextValue {
  isHeroInView: boolean;
}

const HeroInViewContext = createContext<HeroInViewContextValue>({
  isHeroInView: true,
});

export function useHeroInView() {
  return useContext(HeroInViewContext);
}

export function HeroInViewProvider({ children }: { children: React.ReactNode }) {
  const [isHeroInView, setIsHeroInView] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const attach = () => {
      const el = document.getElementById("hero");
      if (!el) return false;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) setIsHeroInView(entry.isIntersecting);
        },
        { threshold: 0.5 }
      );
      observerRef.current.observe(el);
      return true;
    };

    if (attach()) {
      return () => {
        observerRef.current?.disconnect();
        observerRef.current = null;
      };
    }

    const id = window.setInterval(() => {
      if (attach()) window.clearInterval(id);
    }, 100);
    return () => {
      window.clearInterval(id);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  return (
    <HeroInViewContext.Provider value={{ isHeroInView }}>
      {children}
    </HeroInViewContext.Provider>
  );
}
