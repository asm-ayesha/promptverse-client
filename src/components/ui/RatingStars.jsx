"use client";

import { useState } from "react";
import { Star, StarFill } from "@gravity-ui/icons";

// Display-only or interactive star rating.
export default function RatingStars({
  value = 0,
  size = 16,
  interactive = false,
  onChange,
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(active);
        const Icon = filled ? StarFill : Star;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            aria-label={`${star} star`}
          >
            <Icon
              width={size}
              height={size}
              className={filled ? "text-warning" : "text-muted"}
            />
          </button>
        );
      })}
    </div>
  );
}
