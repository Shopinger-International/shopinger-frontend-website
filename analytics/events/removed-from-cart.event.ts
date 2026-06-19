// const
import { ANALYTICS_EVENT_TYPE } from "@/constants/analytics.constant";

// types
import type { ICategoryLevel } from "@/types/campaign";
import type { IAnalyticsSourceType } from "@/types/analytics";

// service
import { analytics } from "@/services/analytics.service";

function removedFromCart({
  user_id,
  product_id,
  variant_id,
  category_id,
  category_type,
  source,
  quantity = 1,
}: {
  user_id: number;
  product_id: number;
  variant_id: number;
  category_id: number;
  category_type: ICategoryLevel;
  source: IAnalyticsSourceType;
  quantity?: number;
}) {
  analytics.track({
    user_id,
    event_name: ANALYTICS_EVENT_TYPE.REMOVED_FROM_CART,
    product_id,
    variant_id,
    category_id,
    category_type,
    quantity,
    source,
  });
}

export default removedFromCart;
