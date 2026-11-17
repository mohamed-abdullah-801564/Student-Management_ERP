---
name: number-ticker
description: Animated number ticker component for React (Next.js/Tailwind with Framer Motion) and React Native / Expo (60fps requestAnimationFrame with ease-out cubic). Use whenever you need KPI counter animations, animated stats, marks/scores counters, percentages, or money/currency tickers.
---

# Number Ticker Component & Skill Guide

This skill provides production-ready, accessible, and high-performance **Number Ticker** components for both **Web (React/Next.js/Tailwind)** and **Mobile (React Native/Expo)**.

---

## 1. Web Implementation (`apps/web`)

### Dependencies
```bash
npm install framer-motion clsx tailwind-merge
```

### Utility (`src/lib/utils.ts`)
```typescript
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Component Code (`src/components/ui/number-ticker.tsx`)
```tsx
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in seconds
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-IN", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }),
    [springValue, decimalPlaces]
  );

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tabular-nums tracking-wider text-black dark:text-white",
        className
      )}
    >
      {direction === "down" ? value : 0}
    </span>
  );
}
```

### Web Usage Example
```tsx
import { NumberTicker } from "@/components/ui/number-ticker";

// Integer counter
<NumberTicker value={1366} className="text-3xl font-extrabold text-slate-900" />

// Decimal percentage counter
<div className="flex items-center text-emerald-600 font-bold">
  <NumberTicker value={96.2} decimalPlaces={1} />
  <span>%</span>
</div>
```

---

## 2. Mobile Implementation (`apps/mobile` - React Native & Expo)

React Native does not use DOM `HTMLSpanElement`, so we use `requestAnimationFrame` with ease-out cubic interpolation for smooth 60fps native performance with zero external native driver dependencies.

### Component Code (`src/components/AnimatedNumberTicker.tsx`)
```tsx
import React, { useEffect, useState } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

interface AnimatedNumberTickerProps {
  value: number;
  decimalPlaces?: number;
  duration?: number; // duration in ms (default: 1000ms)
  prefix?: string;
  suffix?: string;
  style?: StyleProp<TextStyle>;
}

export function AnimatedNumberTicker({
  value,
  decimalPlaces = 0,
  duration = 1000,
  prefix = '',
  suffix = '',
  style,
}: AnimatedNumberTickerProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const startVal = 0;
    const endVal = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease out cubic: 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  const formatted =
    decimalPlaces > 0
      ? displayValue.toFixed(decimalPlaces)
      : Math.round(displayValue).toLocaleString('en-IN');

  return (
    <Text style={style}>
      {prefix}
      {formatted}
      {suffix}
    </Text>
  );
}
```

### Mobile Usage Example
```tsx
import { AnimatedNumberTicker } from '../../src/components/AnimatedNumberTicker';

// Total marks counter
<AnimatedNumberTicker
  value={462}
  style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}
/>

// Percentage counter with decimal place
<AnimatedNumberTicker
  value={94.2}
  decimalPlaces={1}
  suffix="%"
  style={{ fontSize: 16, fontWeight: '700', color: '#10B981' }}
/>
```

---

## 3. Best Practices & Guidelines
1. **Scalar vs Ordinal Metrics**:
   - Animate scalar values (counts, totals, percentages, currency, hours).
   - Do **not** count up rank standing positions (e.g. `Rank #3` should render as a prestigious badge `⭐ Rank #3`, because rank is a standing position, not an accumulated amount).
2. **Localization**:
   - Format numbers using Indian numbering system `en-IN` (`1,00,000` / Lakhs) or locale appropriate formatting.
3. **Tabular Numerals**:
   - Always apply `tabular-nums` on web to avoid layout shifting or jitter while digits animate.
