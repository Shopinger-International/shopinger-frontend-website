import { Zap } from "lucide-react";
import type { FC } from "react";

import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";

const ProductDeliveryTimeBadge: FC = () => {
  const { delivery_time } = useLocationTooltipStateContext();

  if (delivery_time == null) return null;

  return (
    <p
      aria-label={`Estimated delivery: ${delivery_time} minutes`}
      className="mt-1.5 inline-flex max-w-full items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-[10px] text-orange-800 sm:text-xs"
    >
      <Zap
        className="size-2.5 shrink-0 text-green-700"
        strokeWidth={2.75}
        fill="green"
        aria-hidden="true"
      />
      <span className="truncate">
        <span className="font-bold text-green-700">
          {delivery_time} mins
        </span>{" "}
      </span>
    </p>
  );
};

export default ProductDeliveryTimeBadge;
