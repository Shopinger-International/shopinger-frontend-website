import { useEffect } from "react";
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
import useGetCategoryBySlug from "../axios/categories/use-get-category-by-slug.hook";

const useCategoryViewed = ({
  category_slug,
  category_type,
}: {
  category_slug: string;
  category_type: ICategoryLevel;
}) => {
  const { data: user_details } = useUserDetails();
  const { data: category } = useGetCategoryBySlug({
    category_slug,
    category_type,
  });
  const user_id = user_details?.id;
  const category_id = category?.id;
  useEffect(() => {
    const already_viewed = analytics.getQueue.some(
      (event) =>
        event.category_id == category_id &&
        event.category_type == category_type,
    );
    !already_viewed &&
      user_id &&
      category_id &&
      analytics.track({
        user_id,
        event_name: ANALYTICS_EVENT_TYPE.CATEGORY_VIEWED,
        category_id,
        category_type,
        source: ANALYTICS_SOURCE_TYPE.CATEGORY,
      });
  }, [category_slug, category_id]);
};

export default useCategoryViewed;
