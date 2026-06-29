import type { FC } from "react";
import { Star } from "lucide-react";

type IProps = {
  total_stars: number;
  size: number;
  custom_rating: number;
  gap?: number;
};

const Rating: FC<IProps> = ({ total_stars, size, custom_rating, gap = 2 }) => {
  return (
    <div
      className="flex"
      style={{ gap }}
      role="img"
      aria-label={`${custom_rating.toFixed(1)} out of ${total_stars} stars`}
    >
      {Array.from({ length: total_stars }, (_, i) => {
        const index = i + 1;

        return (
          <span key={index}>
            <Star
              aria-hidden={true}
              size={size}
              className={
                index <= custom_rating
                  ? "fill-orange-500 text-orange-500"
                  : "fill-none text-gray-400"
              }
            />
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
