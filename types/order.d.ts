import type IProduct from "@/types/product";

export type ICancelReason =
  | "ORDER_BY_MISTAKE"
  | "FOUND_BETTER_PRICE"
  | "DELAYED_DELIVERY"
  | "CHANGE_OF_MIND"
  | "DUPLICATE_ORDER"
  | "WRONG_ITEM_ORDERED"
  | "NO_LONGER_NEEDED"
  | "HIGH_SHIPPING_COST"
  | "BAD_REVIEWS"
  | "LATE_DELIVERY_EXPECTED"
  | "OTHER";
type IOrderItems = {
  item_id: number;
  item: IProduct;
  status: string;
  quantity: number;
  cancelled_quantity: number;
};

type IOrderStatusHistory = {
  actor_id: number;
  created_at: string;
  from_status: string;
  id: number;
  note: string;
  order_id: number;
  source: string;
  to_status: string;
};
type IOrder = {
  id: number;
  status: string;
  payment_status: string;
  sub_total: number;
  total_amount: number;
  gst: number;
  discount: number;
  delivery_fee: number;
  address_snapshot: {
    area: string;
    city: string;
    phone: string;
    state: string;
    country: string;
    pincode: string;
    landmark: string;
    full_name: string;
    house_number: string;
  };
  order_status_history: IOrderStatusHistory[];
  order_items: IOrderItems[];
  created_at: string;
};

export default IOrder;
