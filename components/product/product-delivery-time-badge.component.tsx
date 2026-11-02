import { Zap } from "lucide-react";
import type { FC } from "react";

import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";

const ProductDeliveryTimeBadge: FC = () => {
  const { delivery_time } = useLocationTooltipStateContext();

  if (delivery_time == null) return null;

  return (
    <p
      aria-label={`Estimated delivery: ${delivery_time} minutes`}
      className="gap mt-1.5 inline-flex max-w-full items-center rounded-lg px-2 py-1 text-[10px] text-black sm:text-xs"
    >
      <Zap
        className="size-2.5 shrink-0"
        strokeWidth={2.75}
        fill="grey"
        aria-hidden="true"
      />
      <span className="truncate">
        <span className="font-bold">{delivery_time} mins</span>{" "}
      </span>
    </p>
  );
};

export default ProductDeliveryTimeBadge;
