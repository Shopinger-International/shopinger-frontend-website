import { Clock3 } from "lucide-react";
import type { FC } from "react";

import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";

const ProductDeliveryTimeBadge: FC = () => {
  const { delivery_time } = useLocationTooltipStateContext();

  if (delivery_time == null) return null;

  return (
    <p
      aria-label={`Estimated delivery: ${delivery_time} minutes`}
      className="mt-1.5 inline-flex max-w-full items-center gap-1 rounded-full px-2 py-1 text-[10px] text-orange-800 sm:text-xs"
    >
      <Clock3
        className="text-brand size-3 shrink-0"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <span className="truncate">
        <span className="text-brand font-bold">{delivery_time} min</span>{" "}
        <span className="font-medium">delivery</span>
      </span>
    </p>
  );
};

export default ProductDeliveryTimeBadge;
