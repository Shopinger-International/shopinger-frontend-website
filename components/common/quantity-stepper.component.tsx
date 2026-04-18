// types
import type { FC } from "react";

// icons
import { Minus, Plus } from "lucide-react";

// helpers
import clsx from "clsx";

type IProps = {
  quantity: number;
  show_increase_disabled: boolean;
  show_decrease_disabled: boolean;
  size?: "small" | "large";
  onIncrease: () => void;
  onDecrease: () => void;
};

const QuantityStepper: FC<IProps> = ({
  quantity,
  show_increase_disabled,
  show_decrease_disabled,
  size = "large",
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="flex items-center overflow-hidden rounded-md border border-gray-300 bg-white">
      {/* Decrease */}
      <button
        onClick={onDecrease}
        disabled={quantity === 1 || show_decrease_disabled}
        className={clsx(
          "flex items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40",
          size == "large" && "size-9 sm:size-10",
          size == "small" && "size-6 sm:size-8",
        )}
      >
        <Minus
          className={clsx(
            size == "large" && "size-4",
            size == "small" && "size-3",
          )}
        />
      </button>

      {/* Quantity */}
      <span
        className={clsx(
          "flex items-center justify-center border-x border-gray-200 text-sm font-semibold text-gray-900",
          size == "large" && "size-9 sm:size-10",
          size == "small" && "size-6 sm:size-8",
        )}
      >
        {quantity}
      </span>

      {/* Increase */}
      <button
        disabled={show_increase_disabled}
        onClick={onIncrease}
        className={clsx(
          "flex items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40",
          size == "large" && "size-9 sm:size-10",
          size == "small" && "size-6 sm:size-8",
        )}
      >
        <Plus
          className={clsx(
            size == "large" && "size-4",
            size == "small" && "size-3",
          )}
        />
      </button>
    </div>
  );
};

export default QuantityStepper;
