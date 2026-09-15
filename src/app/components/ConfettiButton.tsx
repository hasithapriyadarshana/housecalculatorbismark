'use client';

import * as React from 'react';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';
import { cn } from './ui/utils';

type ConfettiButtonProps = React.ComponentProps<typeof Button> & {
  confettiColors?: string[];
};

export function ConfettiButton({ children, confettiColors, onClick, ...props }: ConfettiButtonProps) {
  const fire = React.useCallback(() => {
    const colors = confettiColors ?? ['#ED9420', '#ffffff', '#2D3748', '#F7FAFC'];
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors,
    });
  }, [confettiColors]);

  return (
    <Button
      {...props}
      onClick={(e) => {
        fire();
        onClick?.(e);
      }}
      className={cn(props.className)}
    >
      {children}
    </Button>
  );
}

export function fireSummaryConfetti() {
  const colors = ['#ED9420', '#ffffff', '#2D3748', '#FBD38D'];
  const end = Date.now() + 900;

  confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 }, colors });

  // side cannons
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors });
  }, 150);

  // gentle rain
  const frame = () => {
    confetti({ particleCount: 2, angle: 90, spread: 60, startVelocity: 35, origin: { x: Math.random(), y: 0 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
