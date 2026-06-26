import { useEffect } from "react";

// const
import {
  ANALYTICS_EVENT_TYPE,
  ANALYTICS_SOURCE_TYPE,
} from "@/constants/analytics.constant";
// types
import type { ICategoryLevel } from "@/types/campaign";

// service
import { analytics } from "@/services/analytics.service";

// hook
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

const useProductViewed = ({
  product_id,
  variant_id,
  category_id,
  category_type,
}: {
  product_id: number;
  variant_id: number;
  category_id: number;
  category_type: ICategoryLevel;
}) => {
  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;
  useEffect(() => {
    const already_viewed = analytics.getQueue.some(
      (event) => event.variant_id == variant_id,
    );
    !already_viewed &&
      analytics.track({
        ...(user_id ? { user_id } : {}),
        event_name: ANALYTICS_EVENT_TYPE.PRODUCT_VIEWED,
        product_id,
        variant_id,
        category_id,
        category_type,
        source: ANALYTICS_SOURCE_TYPE.PRODUCT_DETAILS,
      });
  }, [product_id, variant_id]);
};

export default useProductViewed;
