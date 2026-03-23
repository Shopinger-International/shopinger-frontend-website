// types
import type { FC } from "react";

type IProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

const QuantityStepper: FC<IProps> = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex w-fit items-center rounded-md border bg-orange-500 text-white">
      <button
        onClick={onDecrease}
        disabled={quantity === 1}
        className="cursor-pointer px-3 py-1 text-lg disabled:opacity-40"
      >
        −
      </button>

      <span className="px-2 font-medium">{quantity}</span>

      <button onClick={onIncrease} className="cursor-pointer px-3 py-1 text-lg">
        +
      </button>
    </div>
  );
};
export default QuantityStepper;
