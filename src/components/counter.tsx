'use client';

import { useEffect, useState } from 'react';

type CounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
};

export function Counter({ value, suffix = '', duration = 1800 }: CounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}
