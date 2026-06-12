import type IMedia from "@/types/media";

// const
import {
  SORTING_STRATEGY,
  CAMPAIGN_TYPE,
  SCOPE_TYPE,
  CATEGORY_LEVEL,
  DISCOUNT_TYPE,
} from "@/constants/campaign.constant";

export type ISortingStrategy =
  (typeof SORTING_STRATEGY)[keyof typeof SORTING_STRATEGY];

export type ICampaignType = (typeof CAMPAIGN_TYPE)[keyof typeof CAMPAIGN_TYPE];

export type IScopeType = (typeof SCOPE_TYPE)[keyof typeof SCOPE_TYPE];
export type ICategoryLevel =
  (typeof CATEGORY_LEVEL)[keyof typeof CATEGORY_LEVEL];
export type IDiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];

export interface ICategoryDetails {
  id: number;
  name: string;
}

export interface ISaleCampaignCategory {
  main_category: ICategoryDetails;
  sub_category: ICategoryDetails;
  sub_sub_category: ICategoryDetails;
}

type ICampaign = {
  id: number;
  title: string;
  description: string;
  slug: string;
  type: ICampaignType;
  scope: IScopeType;
  category_level?: ICategoryLevel;
  discount_type?: IDiscountType;
  discount_amount: ?number;
  max_discount_amount?: number;
  sale_campaign_categories: ISaleCampaignCategory[];
  sorting_strategy: ISortingStrategy;
  start_at: string;
  end_at: string;
  is_active: boolean;
  banner: string;
  sale_campaign_media: Array<{
    media: IMedia;
  }>;
};

export default ICampaign;
