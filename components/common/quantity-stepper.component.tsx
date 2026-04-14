import type { FC } from "react";
import { Minus, Plus } from "lucide-react";

type IProps = {
  quantity: number;
  show_increase_disabled: boolean;
  show_decrease_disabled: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
};

const QuantityStepper: FC<IProps> = ({
  quantity,
  show_increase_disabled,
  show_decrease_disabled,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="flex items-center overflow-hidden rounded-md border border-gray-300 bg-white">
      {/* Decrease */}
      <button
        onClick={onDecrease}
        disabled={quantity === 1 || show_decrease_disabled}
        className="flex size-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:size-10"
      >
        <Minus size={16} />
      </button>

      {/* Quantity */}
      <span className="flex size-9 items-center justify-center border-x border-gray-200 text-sm font-semibold text-gray-900 sm:size-10">
        {quantity}
      </span>

      {/* Increase */}
      <button
        disabled={show_increase_disabled}
        onClick={onIncrease}
        className="flex size-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:size-10"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantityStepper;
