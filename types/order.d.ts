import type IProduct from "@/types/product";
import type IReview from "@/types/review";

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

type IOrderItem = {
  item_id: number;
  item: IProduct;
  status: string;
  quantity: number;
  cancelled_quantity: number;
  product_review: IReview[];
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

type IAddressSnapshot = {
  full_name: string;
  phone: string;

  place_id: number;
  house_number: string;
  area: string;
  landmark: string;

  city: string;
  state: string;
  pincode: string;
  country: string;

  formatted_address: string;
  latitude: number;
  longitude: number;

  address_type: "HOME" | "WORK" | "OTHER";
  delivery_instructions: "Leave at door";
};
type IOrderStatus =
  | "PENDING"
  | "ORDER_CREATED"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";
type IOrder = {
  id: number;
  order_name: string;
  status: IOrderStatus;
  payment_status: string;
  payment_method: string;
  sub_total: number;
  total_amount: number;
  gst: number;
  discount: number;
  delivery_fee: number;
  address_snapshot: IAddressSnapshot;
  order_status_history: IOrderStatusHistory[];
  order_items: IOrderItem[];
  created_at: string;
};

export default IOrder;
export { IOrderItem, IAddressSnapshot };
