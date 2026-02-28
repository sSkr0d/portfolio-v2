'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

type Phase = 'idle' | 'intro' | 'playing' | 'gameover';
type Direction = 'up' | 'down' | 'left' | 'right';
interface Point {
  x: number;
  y: number;
}

const LS_KEY = 'snake-high-score';

const getTickMs = (score: number) =>
  Math.max(55, 180 - Math.floor(score / 10) * 12);

const DIRECTION_MAP: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
};

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

interface SnakeGameProps {
  onPhaseChange?: (phase: string) => void;
  onScoreChange?: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({
  onPhaseChange,
  onScoreChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const snakeRef = useRef<Point[]>([]);
  const prevSnakeRef = useRef<Point[]>([]);
  const foodRef = useRef<Point>({ x: 0, y: 0 });
  const dirRef = useRef<Direction>('right');
  const nextDirRef = useRef<Direction>('right');
  const gridRef = useRef({ cols: 14, rows: 9, cellSize: 10 });
  const scoreRef = useRef(0);
  const loopRef = useRef<number>(0);
  const lastTickRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setHighScore(Number(stored));
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  const computeGrid = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    if (w === 0 || h === 0) return;
    const cellSize = Math.max(8, Math.floor(Math.min(w, h) / 10));
    const cols = Math.floor(w / cellSize);
    const rows = Math.floor(h / cellSize);
    gridRef.current = {
      cols: Math.max(4, cols),
      rows: Math.max(4, rows),
      cellSize,
    };
    if (canvasRef.current) {
      canvasRef.current.width = gridRef.current.cols * cellSize;
      canvasRef.current.height = gridRef.current.rows * cellSize;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(() => computeGrid());
    ro.observe(el);
    computeGrid();
    return () => ro.disconnect();
  }, [computeGrid]);

  const spawnFood = useCallback(() => {
    const { cols, rows } = gridRef.current;
    const snake = snakeRef.current;
    let p: Point;
    let attempts = 0;
    do {
      p = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      };
      attempts++;
    } while (
      snake.some((s) => s.x === p.x && s.y === p.y) &&
      attempts < 1000
    );
    foodRef.current = p;
  }, []);

  const startGame = useCallback(() => {
    computeGrid();
    const { cols, rows } = gridRef.current;
    const midY = Math.floor(rows / 2);
    const startX = Math.floor(cols / 4);
    const initial = [
      { x: startX, y: midY },
      { x: startX - 1, y: midY },
      { x: startX - 2, y: midY },
    ];
    snakeRef.current = initial.map((s) => ({ ...s }));
    prevSnakeRef.current = initial.map((s) => ({ ...s }));
    dirRef.current = 'right';
    nextDirRef.current = 'right';
    scoreRef.current = 0;
    setScore(0);
    spawnFood();
    lastTickRef.current = performance.now();
    setPhase('playing');
  }, [computeGrid, spawnFood]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { cols, rows, cellSize } = gridRef.current;
    const w = canvas.width;
    const h = canvas.height;
    const now = performance.now();

    const dark = document.documentElement.classList.contains('dark');

    // Interpolation factor between previous and current tick positions
    const tickMs = getTickMs(scoreRef.current);
    const elapsed = now - lastTickRef.current;
    const t = Math.min(1, elapsed / tickMs);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = dark
      ? 'rgba(10, 5, 20, 0.9)'
      : 'rgba(235, 235, 240, 0.9)';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = dark
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, h);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(w, y * cellSize);
      ctx.stroke();
    }

    // --- Food with breathing animation ---
    const food = foodRef.current;
    const fx = food.x * cellSize + cellSize / 2;
    const fy = food.y * cellSize + cellSize / 2;
    const breathe = 1 + 0.25 * Math.sin(now / 250);
    const foodRadius = cellSize * 0.3 * breathe;

    ctx.save();
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = cellSize * 0.8 * breathe;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(fx, fy, foodRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- Snake with smooth interpolation ---
    const curr = snakeRef.current;
    const prev = prevSnakeRef.current;
    if (curr.length === 0) return;

    const bodyColor = dark ? '#8b5cf6' : '#6d28d9';
    const headColor = dark ? '#a78bfa' : '#7c3aed';
    const bodyWidth = cellSize * 0.65;

    // Compute interpolated pixel centers
    const centers = curr.map((seg, i) => {
      const p = prev[i];
      if (!p) {
        return {
          x: seg.x * cellSize + cellSize / 2,
          y: seg.y * cellSize + cellSize / 2,
        };
      }

      const dx = seg.x - p.x;
      const dy = seg.y - p.y;

      // Skip interpolation for wrap-around jumps
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        return {
          x: seg.x * cellSize + cellSize / 2,
          y: seg.y * cellSize + cellSize / 2,
        };
      }

      return {
        x: (p.x + dx * t) * cellSize + cellSize / 2,
        y: (p.y + dy * t) * cellSize + cellSize / 2,
      };
    });

    // Body: thick rounded path with clean 90-degree corners
    if (centers.length > 1) {
      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = bodyWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(centers[0].x, centers[0].y);

      for (let i = 1; i < centers.length; i++) {
        const a = centers[i - 1];
        const b = centers[i];
        const adx = Math.abs(b.x - a.x);
        const ady = Math.abs(b.y - a.y);

        if (adx > cellSize * 1.5 || ady > cellSize * 1.5) {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          continue;
        }

        // When both axes differ (diagonal from interpolation at a turn),
        // insert a corner waypoint so the path stays axis-aligned.
        if (adx > 0.5 && ady > 0.5) {
          const segDy =
            curr[i - 1].y - (prev[i - 1]?.y ?? curr[i - 1].y);
          if (segDy !== 0) {
            ctx.lineTo(a.x, b.y);
          } else {
            ctx.lineTo(b.x, a.y);
          }
        }

        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
    }

    // Head: circle on top of body path
    const hc = centers[0];
    const headRadius = cellSize * 0.42;

    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.arc(hc.x, hc.y, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Eyes positioned based on direction
    const dir = dirRef.current;
    const eyeOff = headRadius * 0.38;
    const eyeR = headRadius * 0.22;
    const pupilR = eyeR * 0.55;

    let e1: Point;
    let e2: Point;
    switch (dir) {
      case 'right':
        e1 = { x: hc.x + eyeOff * 0.7, y: hc.y - eyeOff };
        e2 = { x: hc.x + eyeOff * 0.7, y: hc.y + eyeOff };
        break;
      case 'left':
        e1 = { x: hc.x - eyeOff * 0.7, y: hc.y - eyeOff };
        e2 = { x: hc.x - eyeOff * 0.7, y: hc.y + eyeOff };
        break;
      case 'up':
        e1 = { x: hc.x - eyeOff, y: hc.y - eyeOff * 0.7 };
        e2 = { x: hc.x + eyeOff, y: hc.y - eyeOff * 0.7 };
        break;
      default:
        e1 = { x: hc.x - eyeOff, y: hc.y + eyeOff * 0.7 };
        e2 = { x: hc.x + eyeOff, y: hc.y + eyeOff * 0.7 };
        break;
    }

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(e1.x, e1.y, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(e2.x, e2.y, eyeR, 0, Math.PI * 2);
    ctx.fill();

    const ps = eyeR * 0.3;
    const px = dir === 'right' ? ps : dir === 'left' ? -ps : 0;
    const py = dir === 'down' ? ps : dir === 'up' ? -ps : 0;

    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(e1.x + px, e1.y + py, pupilR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(e2.x + px, e2.y + py, pupilR, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return;

    const tick = (now: number) => {
      if (phaseRef.current !== 'playing') return;

      const tickMs = getTickMs(scoreRef.current);

      if (now - lastTickRef.current >= tickMs) {
        lastTickRef.current = now;

        // Snapshot positions before mutation for smooth interpolation
        prevSnakeRef.current = snakeRef.current.map((s) => ({ ...s }));

        const { cols, rows } = gridRef.current;
        const snake = snakeRef.current;
        const dir = nextDirRef.current;
        dirRef.current = dir;

        const head = { ...snake[0] };
        switch (dir) {
          case 'up':
            head.y--;
            break;
          case 'down':
            head.y++;
            break;
          case 'left':
            head.x--;
            break;
          case 'right':
            head.x++;
            break;
        }

        head.x = ((head.x % cols) + cols) % cols;
        head.y = ((head.y % rows) + rows) % rows;

        if (snake.some((s) => s.x === head.x && s.y === head.y)) {
          endGame();
          return;
        }

        snake.unshift(head);

        if (
          head.x === foodRef.current.x &&
          head.y === foodRef.current.y
        ) {
          scoreRef.current++;
          setScore(scoreRef.current);
          spawnFood();
        } else {
          snake.pop();
        }
      }

      draw();
      loopRef.current = requestAnimationFrame(tick);
    };

    const endGame = () => {
      const hs = Math.max(
        scoreRef.current,
        Number(localStorage.getItem(LS_KEY) || '0'),
      );
      setHighScore(hs);
      try {
        localStorage.setItem(LS_KEY, String(hs));
      } catch {
        /* noop */
      }
      setPhase('gameover');
      draw();
    };

    loopRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(loopRef.current);
  }, [phase, draw, spawnFood]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return;
      const dir = DIRECTION_MAP[e.key];
      if (!dir) return;
      if (e.key.startsWith('Arrow')) e.preventDefault();
      if (dir !== OPPOSITE[dirRef.current]) {
        nextDirRef.current = dir;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={phase === 'idle' ? () => setPhase('intro') : undefined}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-gray-200/50 backdrop-blur-md dark:bg-black/50 dark:backdrop-blur-md${phase === 'idle' ? ' cursor-pointer' : ''}`}
    >
      <canvas
        ref={canvasRef}
        className={`block${phase === 'playing' || phase === 'gameover' ? '' : ' hidden'}`}
      />

      {phase === 'idle' && (
        <span className="animate-pulse text-xs uppercase tracking-[0.35em] text-muted-foreground select-none">
          Click me!
        </span>
      )}

      {phase === 'intro' && (
        <div className="flex flex-col items-center justify-center gap-2 p-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Snake
          </h3>
          <p className="text-center text-[10px] leading-tight text-muted-foreground">
            Arrow keys or WASD to move.
            <br />
            Walls wrap around. Don&apos;t hit yourself.
          </p>
          <button
            onClick={startGame}
            className="mt-1 rounded-lg bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start
          </button>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/60 dark:bg-black/70">
          <span className="text-sm font-bold uppercase tracking-wider text-white">
            Game Over
          </span>
          <span className="text-xs text-white/80">Score: {score}</span>
          <span className="text-[10px] text-white/60">
            Best: {highScore}
          </span>
          <div className="mt-1 flex gap-2">
            <button
              onClick={startGame}
              className="rounded-lg bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Restart
            </button>
            <button
              onClick={() => setPhase('idle')}
              className="rounded-lg border border-white/30 px-3 py-1 text-[10px] font-semibold text-white transition-opacity hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
