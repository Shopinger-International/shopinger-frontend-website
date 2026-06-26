// types
import type IUser from "@/types/user";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { ICategoryLevel } from "@/types/campaign";
import type IOrder from "@/types/order";

// const
import {
  ANALYTICS_EVENT_TYPE,
  ANALYTICS_SOURCE_TYPE,
} from "@/constants/analytics.constant";
export type IAnalyticsEventType =
  (typeof ANALYTICS_EVENT_TYPE)[keyof typeof ANALYTICS_EVENT_TYPE];

export type IAnalyticsSourceType =
  (typeof ANALYTICS_SOURCE_TYPE)[keyof typeof ANALYTICS_SOURCE_TYPE];

export interface IAnalyticsEvent {
  id: number;
  // user
  user_id?: number;
  user?: IUser;

  // event
  event_name: IAnalyticsEventType;

  // product
  product_id?: number;
  product?: IProduct;

  variant_id?: number;
  variant?: IVariant;

  quantity?: number;

  // category
  category_id?: number;
  category_type?: ICategoryLevel;

  order_id?: number;
  order?: IOrder;

  source?: IAnalyticsSourceType;
  section?: string;
  position?: number;

  metadata?: Record<string, any>;
}
