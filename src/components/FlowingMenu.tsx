import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import {
  IdentificationCardIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  HeadCircuitIcon,
  GithubLogoIcon,
  EnvelopeSimpleIcon,
} from '@phosphor-icons/react';
import DecryptedText from '@/components/DecryptedText';
import SnakeGame from '@/components/SnakeGame';

interface MenuItemData {
  link: string;
  text: string;
}

const MENU_ICONS: Record<
  string,
  {
    Icon: React.ComponentType<{ size?: number; color?: string; weight?: 'duotone' }>;
    color: string;
    iconBgClass: string;
  }
> = {
  About: {
    Icon: IdentificationCardIcon,
    color: '#6366f1',
    iconBgClass: 'bg-indigo-100 dark:bg-indigo-200',
  },
  Experience: {
    Icon: BriefcaseIcon,
    color: '#8b5cf6',
    iconBgClass: 'bg-violet-100 dark:bg-violet-200',
  },
  Education: {
    Icon: GraduationCapIcon,
    color: '#7c3aed',
    iconBgClass: 'bg-purple-100 dark:bg-purple-200',
  },
  Skills: {
    Icon: HeadCircuitIcon,
    color: '#06b6d4',
    iconBgClass: 'bg-cyan-100 dark:bg-cyan-200',
  },
  Projects: {
    Icon: GithubLogoIcon,
    color: '#5b21b6',
    iconBgClass: 'bg-violet-100 dark:bg-violet-200',
  },
  Contact: {
    Icon: EnvelopeSimpleIcon,
    color: '#4c1d95',
    iconBgClass: 'bg-purple-100 dark:bg-purple-200',
  },
};

interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  className?: string;
  /** When true, starts the decrypted-text animation on menu labels (e.g. after menu fade-in). */
  startDecrypt?: boolean;
}

interface MenuItemProps extends MenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  className?: string;
  showBorder?: boolean;
  iconComponent?: React.ComponentType<{ size?: number; color?: string; weight?: 'duotone' }>;
  iconColor?: string;
  iconBgClass?: string;
  startDecrypt?: boolean;
  decryptDelay?: number;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 5,
  textColor = '#fff',
  bgColor = '#060010',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#060010',
  borderColor = '#fff',
  className = '',
  startDecrypt = false
}) => {
  const itemLookup = new Map(items.map((item) => [item.text.toLowerCase(), item]));
  const staggerMs = 320;

  const [snakePhase, setSnakePhase] = useState('idle');
  const [snakeScore, setSnakeScore] = useState(0);

  const renderItem = (label: string, layoutClassName: string, index: number) => {
    const item = itemLookup.get(label.toLowerCase());
    if (!item) return null;
    const config = MENU_ICONS[label];

    return (
      <div key={label} className={`${layoutClassName} overflow-hidden rounded-2xl`}>
        <MenuItem
          {...item}
          speed={speed}
          textColor={textColor}
          marqueeBgColor={marqueeBgColor}
          marqueeTextColor={marqueeTextColor}
          borderColor={borderColor}
          className="h-full w-full rounded-2xl"
          iconComponent={config?.Icon}
          iconColor={config?.color}
          iconBgClass={config?.iconBgClass ?? ''}
          startDecrypt={startDecrypt}
          decryptDelay={index * staggerMs}
        />
      </div>
    );
  };

  return (
    <div className={`relative w-full h-full overflow-visible bg-transparent ${className}`.trim()}>
      {snakePhase === 'playing' && (
        <div className="absolute -top-8 right-0 z-30 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
          Score: {snakeScore}
        </div>
      )}
      <nav className="grid h-full w-full grid-cols-6 grid-rows-3 gap-3">
        {renderItem('About', 'col-span-4 row-span-1', 0)}
        <div className="col-span-2 row-span-1 overflow-hidden rounded-2xl">
          <SnakeGame
            onPhaseChange={setSnakePhase}
            onScoreChange={setSnakeScore}
          />
        </div>
        {renderItem('Experience', 'col-span-3 row-span-1', 1)}
        {renderItem('Education', 'col-span-3 row-span-1', 2)}
        {renderItem('Skills', 'col-span-2 row-span-1', 3)}
        {renderItem('Projects', 'col-span-2 row-span-1', 4)}
        {renderItem('Contact', 'col-span-2 row-span-1', 5)}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  className = '',
  showBorder = true,
  iconComponent: Icon,
  iconColor,
  iconBgClass = '',
  startDecrypt = false,
  decryptDelay = 0,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const [delayedDecryptTrigger, setDelayedDecryptTrigger] = useState(false);
  const safeRepetitions = Number.isFinite(repetitions) && repetitions > 0 ? repetitions : 4;

  useEffect(() => {
    if (!startDecrypt) {
      setDelayedDecryptTrigger(false);
      return;
    }
    const t = setTimeout(() => setDelayedDecryptTrigger(true), decryptDelay);
    return () => clearTimeout(t);
  }, [startDecrypt, decryptDelay]);

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
  }, [text, Icon]);

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
  }, [text, Icon, repetitions, speed]);

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
        <DecryptedText
          text={text}
          trigger={delayedDecryptTrigger}
          sequential
          speed={45}
          maxIterations={12}
          className="text-foreground"
          parentClassName="font-semibold uppercase text-[4vh]"
        />
      </a>
      <div
        className="absolute top-0 left-0 z-10 w-full h-full overflow-hidden pointer-events-none translate-y-[101%] bg-black text-white dark:bg-white dark:text-black"
        ref={marqueeRef}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-[url('/noise.webp')] bg-repeat bg-size-[200px_200px] opacity-25 mix-blend-screen dark:invert dark:mix-blend-multiply"
          aria-hidden
        />
        <div className="relative z-15 h-full w-fit flex text-inherit" ref={marqueeInnerRef}>
          {[...Array(safeRepetitions)].map((_, idx) => (
            <div className="marquee-part flex items-center gap-10 shrink-0 text-inherit" key={idx}>
              <span className="whitespace-nowrap uppercase font-normal text-[4vh] leading-none pl-10">{text}</span>
              {Icon && iconColor ? (
                <div
                  className={`relative z-20 flex items-center justify-center w-32 h-12 shrink-0 rounded-2xl p-3 ${iconBgClass}`}
                >
                  <Icon size={42} color={iconColor} weight="duotone" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
