'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { isAnalyticsEnabled } from '@/lib/analytics';

const interactionEvents = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

export default function AnalyticsScript() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const analyticsEnabled = isAnalyticsEnabled();

  useEffect(() => {
    if (!analyticsEnabled) return;

    const handleInteraction = () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleInteraction);
      });
      setHasInteracted(true);
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleInteraction, { once: true, passive: true });
    });

    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleInteraction);
      });
    };
  }, [analyticsEnabled]);

  if (!analyticsEnabled || !hasInteracted) return null;

  return (
    <Script
      id="analytics-script"
      src="https://www.google-analytics.com/analytics.js"
      strategy="lazyOnload"
    />
  );
}
