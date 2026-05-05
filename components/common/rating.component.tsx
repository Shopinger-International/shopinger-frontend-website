import { useState } from "react";
// types
import type { FC } from "react";

// icons
import { Star } from "lucide-react";

const Rating: FC<{
  totalStars: number;
  onChange: (index: number) => void;
  size: number;
  custom_rating?: number;
  gap?: number;
}> = ({ totalStars, onChange, size, custom_rating, gap = 2 }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (index: number) => {
    setRating(index);
    onChange?.(index); // callback to parent if provided
  };
  return (
    <div className={`flex gap-${gap}`}>
      {Array.from({ length: totalStars }, (_, i) => {
        const index = i + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => !custom_rating && setHover(index)}
            onMouseLeave={() => !custom_rating && setHover(0)}
          >
            <Star
              size={size}
              className={`transition-colors ${
                index <= (custom_rating ?? hover ?? rating)
                  ? "fill-orange-500 text-orange-400"
                  : "fill-none text-gray-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
export default Rating;
