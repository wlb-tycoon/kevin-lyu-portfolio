"use client";

import { useEffect, useState, useCallback } from "react";

const GlowCard = ({ children, identifier }) => {
  const [isMounted, setIsMounted] = useState(false);

  const handlePointerMove = useCallback((event) => {
    const container = document.querySelector(`.glow-container-${identifier}`);
    const cards = document.querySelectorAll(`.glow-card-${identifier}`);

    if (!container || !cards) return;

    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 12,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    for (const card of cards) {
      const cardBounds = card.getBoundingClientRect();
      const isInProximity = 
        event?.x > cardBounds.left - CONFIG.proximity &&
        event?.x < cardBounds.left + cardBounds.width + CONFIG.proximity &&
        event?.y > cardBounds.top - CONFIG.proximity &&
        event?.y < cardBounds.top + cardBounds.height + CONFIG.proximity;

      card.style.setProperty("--active", isInProximity ? 1 : CONFIG.opacity);

      if (isInProximity) {
        const cardCenter = [
          cardBounds.left + cardBounds.width * 0.5,
          cardBounds.top + cardBounds.height * 0.5,
        ];

        let angle = (Math.atan2(event?.y - cardCenter[1], event?.x - cardCenter[0]) * 180) / Math.PI;
        angle = angle < 0 ? angle + 360 : angle;
        card.style.setProperty("--start", angle + 90);
      }
    }
  }, [identifier]);

  const setupContainer = useCallback(() => {
    const container = document.querySelector(`.glow-container-${identifier}`);
    if (container) {
      const CONFIG = {
        gap: 32,
        blur: 12,
        spread: 80,
        vertical: false,
      };
      Object.entries({
        "--gap": CONFIG.gap,
        "--blur": CONFIG.blur,
        "--spread": CONFIG.spread,
        "--direction": CONFIG.vertical ? "column" : "row"
      }).forEach(([key, value]) => container.style.setProperty(key, value));
    }
  }, [identifier]);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window === "undefined") return;

    document.body.addEventListener("pointermove", handlePointerMove);
    setupContainer();

    return () => {
      document.body.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handlePointerMove, setupContainer]);

  const cardClasses = `glow-card glow-card-${identifier} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#101123] text-gray-200 rounded-xl hover:border-transparent w-full`;

  const renderCard = (includeGlows = false) => (
    <div className={`glow-container-${identifier} glow-container`}>
      <article className={cardClasses}>
        {includeGlows && <div className="glows" />}
        {children}
      </article>
    </div>
  );

  if (!isMounted) {
    return renderCard(false);
  }

  return renderCard(true);
};

export default GlowCard;
