import type { IOrderStatus } from "@/types/order";

const ORDER_STATUS: Partial<Record<IOrderStatus, IOrderStatus>> = {
  ORDER_CREATED: "ORDER_CREATED",
  PROCESSING: "PROCESSING",
  ASSIGNED: "ASSIGNED",
  PICKED_UP: "PICKED_UP",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export default ORDER_STATUS;