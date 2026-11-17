import React, { useEffect, useState } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

interface AnimatedNumberTickerProps {
  value: number;
  decimalPlaces?: number;
  duration?: number; // duration in ms
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
