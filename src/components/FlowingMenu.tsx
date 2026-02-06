import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface MenuItemData {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  className?: string;
}

interface MenuItemProps extends MenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  className?: string;
  showBorder?: boolean;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = '#060010',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#060010',
  borderColor = '#fff',
  className = ''
}) => {
  const itemLookup = new Map(items.map((item) => [item.text.toLowerCase(), item]));

  const renderItem = (label: string, layoutClassName: string) => {
    const item = itemLookup.get(label.toLowerCase());
    if (!item) return null;

    return (
      <div className={`${layoutClassName} overflow-hidden rounded-2xl`}>
        <MenuItem
          {...item}
          speed={speed}
          textColor={textColor}
          marqueeBgColor={marqueeBgColor}
          marqueeTextColor={marqueeTextColor}
          borderColor={borderColor}
          className="h-full w-full rounded-2xl"
        />
      </div>
    );
  };

  return (
    <div className={`w-full h-full overflow-hidden bg-transparent ${className}`.trim()}>
      <nav className="grid h-full w-full grid-cols-6 grid-rows-3 gap-3">
        {renderItem('About', 'col-span-4 row-span-1')}
        <div
          className="col-span-2 row-span-1 relative flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-gray-200/50 backdrop-blur-md dark:bg-black/50 dark:backdrop-blur-md"
          aria-hidden="true"
        >
          <span className="relative z-10 text-xs uppercase tracking-[0.35em] text-muted-foreground">Placeholder</span>
          <div
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-[url('/noise.webp')] bg-repeat bg-size-[200px_200px] opacity-15"
            aria-hidden
          />
        </div>
        {renderItem('Experience', 'col-span-3 row-span-1')}
        {renderItem('Education', 'col-span-3 row-span-1')}
        {renderItem('Skills', 'col-span-2 row-span-1')}
        {renderItem('Projects', 'col-span-2 row-span-1')}
        {renderItem('Contact', 'col-span-2 row-span-1')}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  className = '',
  showBorder = true
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const safeRepetitions = Number.isFinite(repetitions) && repetitions > 0 ? repetitions : 4;

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth <= 0) return;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      const safeNeeded = Number.isFinite(needed) ? Math.max(4, needed) : 4;
      setRepetitions(safeNeeded);
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      });
    };

    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div
      className={`relative flex h-full w-full overflow-hidden rounded-2xl bg-gray-200/50 text-center backdrop-blur-md dark:bg-black/50 dark:backdrop-blur-md ${showBorder ? 'border border-border' : 'border-0'} ${className}`.trim()}
      ref={itemRef}
    >
      <a
        className="relative z-10 flex h-full w-full items-center justify-center font-semibold uppercase no-underline text-foreground cursor-pointer text-[4vh]"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
      <div
        className="absolute top-0 left-0 z-10 w-full h-full overflow-hidden pointer-events-none translate-y-[101%] bg-black text-white dark:bg-white dark:text-black"
        ref={marqueeRef}
      >
        <div className="h-full w-fit flex text-inherit" ref={marqueeInnerRef}>
          {[...Array(safeRepetitions)].map((_, idx) => (
            <div className="marquee-part flex items-center shrink-0 text-inherit" key={idx}>
              <span className="whitespace-nowrap uppercase font-normal text-[4vh] leading-none px-[1vw]">{text}</span>
              <div
                className="w-[200px] h-[7vh] my-[2em] mx-[2vw] py-[1em] rounded-[50px] bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-[url('/noise.webp')] bg-repeat bg-size-[200px_200px] opacity-15"
        aria-hidden
      />
    </div>
  );
};

export default FlowingMenu;
