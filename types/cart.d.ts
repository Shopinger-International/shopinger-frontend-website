import type IProduct from "@/types/product";
import type IVariant from "./variant";

export type IStockStatus = "OUT_OF_STOCK" | "STOCK_EXCEEDED" | "AVAILABLE";
export type ICart = {
  items: (Omit<IProduct, "variants"> & {
    variants: (IVariant & {
      selected_stock: number;
      stock_status: IStockStatus;
    })[];
  })[];
  total_amount: number;
  total_discount: number;
  total_items: number;
};
