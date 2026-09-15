'use client';

import * as React from 'react';

type CountUpProps = {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
};

export function CountUp({ value, duration = 2200, className, prefix = '' }: CountUpProps) {
  const [display, setDisplay] = React.useState(0);
  const rafRef = React.useRef<number>(0);
  const decimals = React.useMemo(() => (Number.isInteger(value) ? 0 : 1), [value]);

  React.useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(value * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {formatted}
    </span>
  );
}
