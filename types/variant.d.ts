import type IAttributeType from "@/types/attribute";
import type IMedia from "@/types/media";

type ISkuRow = {
  sku: string;
  mrp: number;
  selling_price_without_commission: number;
  selling_price_with_commission: number;
  stock: number;
  low_stock_threshold: number;
  enabled: boolean;
  [key: string]: any; // for dynamic or extra fields
};

type IVariantInventory = {
  stock: number;
  low_stock_threshold: number;
};

type IVariantPricing = {
  mrp: number;
  selling_price: number;
  selling_price_with_commission: number;
  variant_id: number;
};

type IVariantAttributeValues = {
  attribute_id: number;
  value: any;
  attribute: IAttributeType;
};

type IVariant = {
  id: number;
  is_enabled: boolean;
  product_id: number;
  seller_sku: string | null;
  system_sku: string;
  variant_attribute_values: IVariantAttributeValues[];
  variant_inventory: IVariantInventory;
  variant_pricing: IVariantPricing;
  variant_medias: {
    media: IMedia;
  }[];
};
export default IVariant;
export { IVariantInventory, IVariantAttributeValues };
