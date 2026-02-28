'use client';

import React, { useState, useCallback } from 'react';
import SnakeGame from '@/components/SnakeGame';
import JetpackRun from '@/components/JetpackRun';

type Screen = 'idle' | 'select' | 'snake' | 'jetpack';

interface MiniGameLauncherProps {
  onPhaseChange?: (phase: string) => void;
  onScoreChange?: (score: number) => void;
}

const MiniGameLauncher: React.FC<MiniGameLauncherProps> = ({
  onPhaseChange,
  onScoreChange,
}) => {
  const [screen, setScreen] = useState<Screen>('idle');

  const handleChildPhaseChange = useCallback(
    (phase: string) => {
      onPhaseChange?.(phase);
      if (phase === 'closed') {
        setScreen('idle');
        onPhaseChange?.('idle');
        onScoreChange?.(0);
      }
    },
    [onPhaseChange, onScoreChange],
  );

  if (screen === 'snake') {
    return (
      <SnakeGame
        onPhaseChange={handleChildPhaseChange}
        onScoreChange={onScoreChange}
      />
    );
  }

  if (screen === 'jetpack') {
    return (
      <JetpackRun
        onPhaseChange={handleChildPhaseChange}
        onScoreChange={onScoreChange}
      />
    );
  }

  return (
    <div
      onClick={screen === 'idle' ? () => setScreen('select') : undefined}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-gray-200/50 backdrop-blur-md dark:bg-black/50 dark:backdrop-blur-md${screen === 'idle' ? ' cursor-pointer' : ''}`}
    >
      {screen === 'idle' && (
        <span className="animate-pulse text-xs uppercase tracking-[0.35em] text-muted-foreground select-none">
          Click me!
        </span>
      )}

      {screen === 'select' && (
        <div className="flex flex-col items-center gap-2 p-3">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Pick a game
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setScreen('snake')}
              className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Snake
            </button>
            <button
              onClick={() => setScreen('jetpack')}
              className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Jetpack
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGameLauncher;
