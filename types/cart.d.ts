import type IProduct from "@/types/product";
import type IVariant from "./variant";

export type ICart = {
  items: (Omit<IProduct, "variants"> & {
    variants: (IVariant & {
      selected_stock: number;
    })[];
  })[];
  sub_total: number;
  total_items: number;
};
