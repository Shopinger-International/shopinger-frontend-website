// const
import { ANALYTICS_EVENT_TYPE } from "@/constants/analytics.constant";

// types
import type { ICategoryLevel } from "@/types/campaign";
import type { IAnalyticsSourceType } from "@/types/analytics";

// service
import { analytics } from "@/services/analytics.service";

function buyNowClickedEvent({
  user_id,
  product_id,
  variant_id,
  category_id,
  category_type,
  source,
}: {
  user_id: number;
  product_id: number;
  variant_id: number;
  category_id: number;
  category_type: ICategoryLevel;
  source: IAnalyticsSourceType;
}) {
  analytics.track({
    user_id,
    event_name: ANALYTICS_EVENT_TYPE.BUY_NOW_CLICKED,
    product_id,
    variant_id,
    category_id,
    category_type,
    quantity: 1,
    source,
  });
}

export default buyNowClickedEvent;
