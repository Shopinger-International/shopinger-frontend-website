import type { FC } from "react";
import { Minus, Plus } from "lucide-react";

type IProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

const QuantityStepper: FC<IProps> = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center overflow-hidden rounded-md border border-gray-300 bg-white">
      {/* Decrease */}
      <button
        onClick={onDecrease}
        disabled={quantity === 1}
        className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={16} />
      </button>

      {/* Quantity */}
      <span className="flex h-10 min-w-10 items-center justify-center border-x border-gray-200 text-sm font-semibold text-gray-900">
        {quantity}
      </span>

      {/* Increase */}
      <button
        onClick={onIncrease}
        className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantityStepper;
