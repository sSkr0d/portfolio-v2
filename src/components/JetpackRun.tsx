'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

type Phase = 'intro' | 'playing' | 'gameover';

interface Obstacle {
  x: number;
  w: number;
  gapY: number;
  gapH: number;
}

interface Coin {
  x: number;
  y: number;
}

interface HealthPack {
  x: number;
  y: number;
}

const LS_KEY = 'jetpack-high-score';
const GRAVITY = 0.16;
const THRUST = -0.38;
const BASE_SPEED = 2.2;
const SPEED_INC = 0.15;
const OBSTACLE_GAP_MIN = 0.48;
const OBSTACLE_GAP_MAX = 0.62;
const OBSTACLE_W = 10;
const SPAWN_INTERVAL_MIN = 110;
const SPAWN_INTERVAL_MAX = 200;
const COIN_RADIUS = 6;
const COIN_VALUE = 5;
const COIN_SPAWN_INTERVAL = 55;
const HEALTH_PACK_R = 10;
const HEALTH_PACK_SPAWN_INTERVAL = 280;
const INVINCIBLE_MS = 1800;
const MAX_HEALTH = 2;

interface JetpackRunProps {
  onPhaseChange?: (phase: string) => void;
  onScoreChange?: (score: number) => void;
}

const JetpackRun: React.FC<JetpackRunProps> = ({
  onPhaseChange,
  onScoreChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const phaseRef = useRef<Phase>('intro');
  const loopRef = useRef<number>(0);
  const playerRef = useRef({ y: 0, vy: 0 });
  const thrustRef = useRef(false);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const healthPacksRef = useRef<HealthPack[]>([]);
  const distRef = useRef(0);
  const scoreRef = useRef(0);
  const nextSpawnRef = useRef(0);
  const nextCoinSpawnRef = useRef(0);
  const nextHealthPackSpawnRef = useRef(0);
  const lastFrameRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, groundY: 0, playerX: 0, playerSize: 0 });
  const legPhaseRef = useRef(0);
  const healthRef = useRef(MAX_HEALTH);
  const invincibleUntilRef = useRef(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setHighScore(Number(stored));
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  const computeSize = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    if (w === 0 || h === 0) return;
    const groundY = h - 6;
    const playerSize = Math.max(12, Math.min(w, h) * 0.18);
    const playerX = w * 0.18;
    sizeRef.current = { w, h, groundY, playerX, playerSize };
    if (canvasRef.current) {
      canvasRef.current.width = w;
      canvasRef.current.height = h;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(() => computeSize());
    ro.observe(el);
    computeSize();
    return () => ro.disconnect();
  }, [computeSize]);

  const startGame = useCallback(() => {
    computeSize();
    const { groundY, playerSize } = sizeRef.current;
    playerRef.current = { y: groundY - playerSize, vy: 0 };
    thrustRef.current = false;
    obstaclesRef.current = [];
    coinsRef.current = [];
    healthPacksRef.current = [];
    distRef.current = 0;
    scoreRef.current = 0;
    nextSpawnRef.current = SPAWN_INTERVAL_MAX;
    nextCoinSpawnRef.current = COIN_SPAWN_INTERVAL;
    nextHealthPackSpawnRef.current = HEALTH_PACK_SPAWN_INTERVAL;
    lastFrameRef.current = performance.now();
    legPhaseRef.current = 0;
    healthRef.current = MAX_HEALTH;
    invincibleUntilRef.current = 0;
    setScore(0);
    setPhase('playing');
  }, [computeSize]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h, groundY, playerX, playerSize } = sizeRef.current;
    const now = performance.now();
    const dark = document.documentElement.classList.contains('dark');

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = dark ? 'rgba(10, 5, 20, 0.95)' : 'rgba(235, 235, 240, 0.95)';
    ctx.fillRect(0, 0, w, h);

    // Ground line
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Obstacles
    const obstColor = dark ? '#ef4444' : '#dc2626';
    for (const ob of obstaclesRef.current) {
      ctx.fillStyle = obstColor;
      ctx.fillRect(ob.x, 0, ob.w, ob.gapY);
      ctx.fillRect(ob.x, ob.gapY + ob.gapH, ob.w, groundY - ob.gapY - ob.gapH);
    }

    // Coins
    ctx.fillStyle = '#eab308';
    ctx.strokeStyle = dark ? '#a16207' : '#ca8a04';
    ctx.lineWidth = 1;
    for (const c of coinsRef.current) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, COIN_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Health packs
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = dark ? '#15803d' : '#16a34a';
    ctx.lineWidth = 1.5;
    for (const hp of healthPacksRef.current) {
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, HEALTH_PACK_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${HEALTH_PACK_R}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', hp.x, hp.y);
      ctx.fillStyle = '#22c55e';
    }

    // Player (flash when invincible)
    const invincible = invincibleUntilRef.current > performance.now();
    const flash = invincible && Math.floor(performance.now() / 80) % 2 === 0;
    if (flash) {
      ctx.globalAlpha = 0.5;
    }

    // Player
    const py = playerRef.current.y;
    const onGround = py >= groundY - playerSize - 0.5;
    const ps = playerSize;
    const px = playerX;
    const bodyW = ps * 0.5;
    const bodyH = ps * 0.75;
    const bodyX = px - bodyW / 2;
    const bodyY = py + ps * 0.1;
    const headR = ps * 0.22;
    const headCx = px;
    const headCy = py + ps * 0.05;

    // Jetpack (on the back)
    const jpW = ps * 0.16;
    const jpH = bodyH * 0.55;
    const jpX = bodyX - jpW + 1;
    const jpY = bodyY + bodyH * 0.2;
    ctx.fillStyle = dark ? '#64748b' : '#475569';
    ctx.beginPath();
    ctx.roundRect(jpX, jpY, jpW, jpH, 2);
    ctx.fill();

    // Body (capsule shape)
    ctx.fillStyle = dark ? '#a78bfa' : '#7c3aed';
    ctx.beginPath();
    ctx.roundRect(bodyX, bodyY, bodyW, bodyH, ps * 0.15);
    ctx.fill();

    // Head
    ctx.fillStyle = dark ? '#c4b5fd' : '#8b5cf6';
    ctx.beginPath();
    ctx.arc(headCx, headCy, headR, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    ctx.fillStyle = dark ? '#312e81' : '#1e1b4b';
    ctx.beginPath();
    ctx.arc(headCx + headR * 0.2, headCy - headR * 0.05, headR * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    const legLen = ps * 0.22;
    const legW = ps * 0.1;
    const legBaseY = bodyY + bodyH;
    if (onGround) {
      const lp = legPhaseRef.current;
      const leg1Off = Math.sin(lp) * ps * 0.12;
      const leg2Off = Math.sin(lp + Math.PI) * ps * 0.12;
      ctx.fillStyle = dark ? '#7c3aed' : '#5b21b6';
      ctx.fillRect(px - bodyW * 0.25 + leg1Off, legBaseY, legW, legLen);
      ctx.fillRect(px + bodyW * 0.05 + leg2Off, legBaseY, legW, legLen);
    } else {
      ctx.fillStyle = dark ? '#7c3aed' : '#5b21b6';
      ctx.fillRect(px - bodyW * 0.25, legBaseY, legW, legLen * 0.7);
      ctx.fillRect(px + bodyW * 0.05, legBaseY, legW, legLen * 0.7);
    }

    // Flame when thrusting
    if (thrustRef.current && !onGround) {
      const flameH = ps * 0.3 + Math.random() * ps * 0.15;
      const flameCx = jpX + jpW / 2;
      const flameTop = jpY + jpH;

      const grad = ctx.createLinearGradient(flameCx, flameTop, flameCx, flameTop + flameH);
      grad.addColorStop(0, '#fbbf24');
      grad.addColorStop(0.5, '#f97316');
      grad.addColorStop(1, 'rgba(239,68,68,0)');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(flameCx - jpW * 0.6, flameTop);
      ctx.quadraticCurveTo(flameCx, flameTop + flameH, flameCx + jpW * 0.6, flameTop);
      ctx.fill();
    }

    // Floor flame when thrusting and on or near ground
    if (thrustRef.current && onGround) {
      const flameCx = jpX + jpW / 2;
      const flameH = ps * 0.2 + Math.random() * ps * 0.1;
      const flameTop = jpY + jpH;
      const grad = ctx.createLinearGradient(flameCx, flameTop, flameCx, flameTop + flameH);
      grad.addColorStop(0, '#fbbf24');
      grad.addColorStop(1, 'rgba(239,68,68,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(flameCx - jpW * 0.5, flameTop);
      ctx.quadraticCurveTo(flameCx, flameTop + flameH, flameCx + jpW * 0.5, flameTop);
      ctx.fill();
    }

    if (flash) ctx.globalAlpha = 1;

    // Health hearts (top-left)
    const hearts = healthRef.current;
    const heartX = 14;
    const heartY = 14;
    const heartR = 5;
    for (let i = 0; i < MAX_HEALTH; i++) {
      ctx.fillStyle = i < hearts ? '#ef4444' : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)');
      ctx.beginPath();
      ctx.arc(heartX + i * (heartR * 2.4), heartY, heartR, 0, Math.PI * 2);
      ctx.fill();
    }

    void now;
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return;

    const tick = (now: number) => {
      if (phaseRef.current !== 'playing') return;
      const dt = Math.min(now - lastFrameRef.current, 32) / 16;
      lastFrameRef.current = now;

      const { w, groundY, playerSize, playerX: px } = sizeRef.current;
      const player = playerRef.current;
      const speed = BASE_SPEED + Math.floor(scoreRef.current / 10) * SPEED_INC;

      // Physics
      if (thrustRef.current) {
        player.vy += THRUST * dt;
      } else {
        player.vy += GRAVITY * dt;
      }
      player.y += player.vy * dt;

      // Floor
      if (player.y >= groundY - playerSize) {
        player.y = groundY - playerSize;
        player.vy = 0;
        legPhaseRef.current += speed * dt * 0.5;
      }

      // Ceiling
      if (player.y < 0) {
        player.y = 0;
        player.vy = 0;
      }

      // Scroll obstacles
      const obstacles = obstaclesRef.current;
      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= speed * dt;
        if (obstacles[i].x + obstacles[i].w < 0) {
          obstacles.splice(i, 1);
        }
      }

      // Scroll coins
      const coins = coinsRef.current;
      for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].x -= speed * dt;
        if (coins[i].x + COIN_RADIUS < 0) coins.splice(i, 1);
      }

      // Scroll health packs
      const healthPacks = healthPacksRef.current;
      for (let i = healthPacks.length - 1; i >= 0; i--) {
        healthPacks[i].x -= speed * dt;
        if (healthPacks[i].x + HEALTH_PACK_R < 0) healthPacks.splice(i, 1);
      }

      // Spawn obstacles
      distRef.current += speed * dt;
      nextSpawnRef.current -= speed * dt;
      if (nextSpawnRef.current <= 0) {
        const gapH = groundY * (OBSTACLE_GAP_MIN + Math.random() * (OBSTACLE_GAP_MAX - OBSTACLE_GAP_MIN));
        const maxGapY = groundY - gapH - 4;
        const gapY = Math.random() * maxGapY;
        obstacles.push({ x: w + 4, w: OBSTACLE_W, gapY, gapH });
        nextSpawnRef.current = SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
      }

      // Spawn coins (in safe vertical band)
      nextCoinSpawnRef.current -= speed * dt;
      if (nextCoinSpawnRef.current <= 0) {
        const cy = 20 + Math.random() * (groundY - 40);
        coins.push({ x: w + COIN_RADIUS * 2, y: cy });
        nextCoinSpawnRef.current = COIN_SPAWN_INTERVAL;
      }

      // Spawn health packs
      nextHealthPackSpawnRef.current -= speed * dt;
      if (nextHealthPackSpawnRef.current <= 0) {
        const hy = 24 + Math.random() * (groundY - 48);
        healthPacks.push({ x: w + HEALTH_PACK_R * 2, y: hy });
        nextHealthPackSpawnRef.current = HEALTH_PACK_SPAWN_INTERVAL;
      }

      const pLeft = px - playerSize * 0.25;
      const pRight = px + playerSize * 0.25;
      const pTop = player.y + playerSize * 0.05;
      const pBottom = player.y + playerSize * 0.85;
      const pCx = (pLeft + pRight) / 2;
      const pCy = (pTop + pBottom) / 2;
      const invincible = invincibleUntilRef.current > now;

      // Coin collision
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        const dx = pCx - c.x;
        const dy = pCy - c.y;
        if (dx * dx + dy * dy < (playerSize * 0.35 + COIN_RADIUS) ** 2) {
          scoreRef.current += COIN_VALUE;
          setScore(scoreRef.current);
          coins.splice(i, 1);
        }
      }

      // Health pack collision
      for (let i = healthPacks.length - 1; i >= 0; i--) {
        const hp = healthPacks[i];
        const dx = pCx - hp.x;
        const dy = pCy - hp.y;
        if (dx * dx + dy * dy < (playerSize * 0.35 + HEALTH_PACK_R) ** 2) {
          healthRef.current = Math.min(MAX_HEALTH, healthRef.current + 1);
          healthPacks.splice(i, 1);
        }
      }

      // Obstacle collision (damage if not invincible)
      for (const ob of obstacles) {
        if (pRight > ob.x && pLeft < ob.x + ob.w) {
          if (pTop < ob.gapY || pBottom > ob.gapY + ob.gapH) {
            if (!invincible) {
              healthRef.current--;
              invincibleUntilRef.current = now + INVINCIBLE_MS;
              if (healthRef.current <= 0) {
                endGame();
                return;
              }
            }
            break;
          }
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
      try { localStorage.setItem(LS_KEY, String(hs)); } catch { /* noop */ }
      setPhase('gameover');
      draw();
    };

    loopRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(loopRef.current);
  }, [phase, draw]);

  // Input: prevent Space from scrolling page when playing or game over (reflex taps)
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        const p = phaseRef.current;
        if (p === 'playing' || p === 'gameover') {
          e.preventDefault();
        }
        if (p === 'playing') {
          thrustRef.current = true;
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        thrustRef.current = false;
      }
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // Pointer (touch / mouse) support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onDown = () => {
      if (phaseRef.current === 'playing') thrustRef.current = true;
    };
    const onUp = () => {
      thrustRef.current = false;
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-gray-200/50 backdrop-blur-md dark:bg-black/50 dark:backdrop-blur-md"
    >
      <canvas
        ref={canvasRef}
        className={`block${phase === 'playing' || phase === 'gameover' ? '' : ' hidden'}`}
      />

      {phase === 'intro' && (
        <div className="flex flex-col items-center justify-center gap-2 p-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Jetpack Run
          </h3>
          <p className="text-center text-[10px] leading-tight text-muted-foreground">
            Hold Space or tap to fly.
            <br />
            Release to fall. Dodge obstacles.
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
          <span className="text-[10px] text-white/60">Best: {highScore}</span>
          <div className="mt-1 flex gap-2">
            <button
              onClick={startGame}
              className="rounded-lg bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Restart
            </button>
            <button
              onClick={() => onPhaseChange?.('closed')}
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

export default JetpackRun;
