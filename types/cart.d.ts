import type IProduct from "@/types/product";
import type IVariant from "./variant";

export type ICart = {
  items: (Omit<IProduct, "variants"> & {
    variants: (IVariant & {
      selected_stock: number;
    })[];
  })[];
  total_amount: number;
  total_items: number;
};