import type IVariant from "@/types/variant";
import type IAttributeType from "@/types/attribute";
import type IMedia from "@/types/media";
import type IVendor from "@/types/vendor";
import type {
  ICategory,
  ISubCategory,
  ISubSubCategory,
} from "@/types/categories";

type IProduct = {
  id: number;
  title: string;
  brand: string;
  country_of_origin: string;
  description: string;
  importer_address: string;
  importer_name: string;
  importer_pincode: string;
  key_features: string;
  keywords: string;
  manufacturer_address: string;
  manufacturer_name: string;
  manufacturer_pincode: string;
  product_medias: Array<{
    id: number;
    media: IMedia;
    position: number;
  }>;
  packer_address: string;
  packer_name: string;
  packer_pincode: string;
  variants: IVariant[];
  vendor_id: number;
  vendor: IVendor;
  variant_visual_attribute_medias: Array<{
    attribute_id: number;
    attribute_value: string;
    media: IMedia;
  }>;
  product_attribute_values: Array<{
    attribute: IAttributeType;
    value;
  }>;
  reviews_count: number;
  sub_sub_category_id: number;
  main_category: ICategory;
  sub_category: ISubCategory;
  sub_sub_category: ISubSubCategory;
  is_enabled: boolean;
  created_at: string;
};

type IAlgoliaProduct = {
  objectID: string;
  product_id: number;
  title: string;
  category: string;
  sub_category: string;
  sub_sub_category: string;
  price: number;
  mrp: number;
  stock: number;
  reserved_stock: number;
  url: string;
  search_keywords: Array<string>;
  image: string;
  color: string;
};

export { IAlgoliaProduct };
export default IProduct;
