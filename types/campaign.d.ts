import IMedia from "@/types/media";

export type ICampaignType =
  | "FLASH_SALE"
  | "SEASONAL_SALE"
  | "CLEARANCE"
  | "CATEGORY_SALE"
  | "TIME_WINDOW_SALE"
  | "FESTIVAL_SALE"
  | "PERSONALIZED"
  | "BANNER_PROMOTION"
  | "CUSTOM";

export type IScopeType = "ALL" | "CATEGORY" | "PRODUCT";
export type ICategoryLevel = "MAIN" | "SUB" | "SUB_SUB";
export type IDiscountType = "FIXED" | "PERCENTAGE";

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
  start_at: string;
  end_at: string;
  is_active: boolean;
  banner: string;
  sale_campaign_media: Array<{
    media: IMedia;
  }>;
};

export default ICampaign;
