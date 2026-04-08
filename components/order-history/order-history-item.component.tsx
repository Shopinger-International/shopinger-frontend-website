// types
import type { FC } from "react";
import type IOrder from "@/types/order";

// local components
import OrderHistoryProduct from "@/components/order-history/order-history-product.component";

// helpers
import { formateDate } from "@/helpers/common.helper";

type IProps = {
  order: IOrder;
};

const OrderHistoryItem: FC<IProps> = ({ order }) => {
  console.log("value of order",order);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white p-6">
      <div className="flex flex-wrap justify-between gap-6">
        <div className="max-w-96">
          <div className="flex items-center gap-4">
            <span className="text-[15px] font-semibold text-slate-600">
              Order #{order.id}
            </span>
            <span className="rounded-md bg-green-100 px-3 py-1.5 text-xs font-medium text-green-900">
              {order.status}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Placed on May {formateDate(order.created_at)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-slate-900">$208.00</p>
          <p className="mt-2 text-sm text-slate-600">
            {order.order_items.length} items
          </p>
        </div>
      </div>
      <hr className="my-6 border-gray-300" />
      <div className="flex flex-wrap items-center gap-8">
        {/* {order.order_items.flatMap(
          ({ quantity, item: { variants, ...product } }) => (
            <OrderHistoryProduct
              quantity={quantity}
              product={product}
              key={`cart-item-${variant.id}`}
              is_delivered={true}
              is_reviewed={false}
              handleShowReviewModal={() =>
                setReviewModalState({
                  open: true,
                  product,
                  variant,
                })
              }
            />
          ),
        )} */}
        {order?.order_items?.flatMap(
          ({ quantity, item: { variants, ...product } }) =>
            variants?.map((variant) => (
              <OrderHistoryProduct
                quantity={quantity}
                variant={variant}
                product={product}
                key={`cart-item-${variant.id}`}
              />
            )),
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 511.999 511.999"
          >
            <path
              d="M508.745 246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818 239.784 3.249 246.035a16.896 16.896 0 0 0 0 19.923c4.569 6.257 113.557 153.206 252.748 153.206s248.174-146.95 252.748-153.201a16.875 16.875 0 0 0 0-19.922zM255.997 385.406c-102.529 0-191.33-97.533-217.617-129.418 26.253-31.913 114.868-129.395 217.617-129.395 102.524 0 191.319 97.516 217.617 129.418-26.253 31.912-114.868 129.395-217.617 129.395z"
              data-original="#000000"
            />
            <path
              d="M255.997 154.725c-55.842 0-101.275 45.433-101.275 101.275s45.433 101.275 101.275 101.275S357.272 311.842 357.272 256s-45.433-101.275-101.275-101.275zm0 168.791c-37.23 0-67.516-30.287-67.516-67.516s30.287-67.516 67.516-67.516 67.516 30.287 67.516 67.516-30.286 67.516-67.516 67.516z"
              data-original="#000000"
            />
          </svg>
          View Details
        </button>
        <button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path
              d="M12.005 23.8c-3.186 0-6.136-1.18-8.378-3.422-.472-.472-.472-1.18 0-1.652s1.18-.472 1.652 0c1.888 1.77 4.248 2.714 6.726 2.714 5.192 0 9.44-4.248 9.44-9.44s-4.248-9.44-9.44-9.44c-2.478 0-4.838.944-6.726 2.714-.944.944-2.95 3.304-3.068 3.422-.472.472-1.18.59-1.652.118s-.59-1.18-.118-1.652c.118-.118 2.124-2.478 3.186-3.422C5.869 1.38 8.819.2 12.005.2c6.49 0 11.8 5.31 11.8 11.8s-5.31 11.8-11.8 11.8z"
              data-original="#000000"
            />
            <path
              d="M6.105 9.05h-4.72c-.708 0-1.18-.472-1.18-1.18V3.15c0-.708.472-1.18 1.18-1.18s1.18.472 1.18 1.18v3.54h3.54c.708 0 1.18.472 1.18 1.18s-.472 1.18-1.18 1.18z"
              data-original="#000000"
            />
          </svg>
          Reorder
        </button>
        <button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 512 512"
          >
            <path
              d="m433.798 106.268-96.423-91.222C327.119 5.343 313.695 0 299.577 0H116C85.673 0 61 24.673 61 55v402c0 30.327 24.673 55 55 55h280c30.327 0 55-24.673 55-55V146.222c0-15.049-6.27-29.612-17.202-39.954zM404.661 120H330c-2.757 0-5-2.243-5-5V44.636zM396 482H116c-13.785 0-25-11.215-25-25V55c0-13.785 11.215-25 25-25h179v85c0 19.299 15.701 35 35 35h91v307c0 13.785-11.215 25-25 25z"
              data-original="#000000"
            />
            <path
              d="M363 200H143c-8.284 0-15 6.716-15 15s6.716 15 15 15h220c8.284 0 15-6.716 15-15s-6.716-15-15-15zm0 80H143c-8.284 0-15 6.716-15 15s6.716 15 15 15h220c8.284 0 15-6.716 15-15s-6.716-15-15-15zm-147.28 80H143c-8.284 0-15 6.716-15 15s6.716 15 15 15h72.72c8.284 0 15-6.716 15-15s-6.716-15-15-15z"
              data-original="#000000"
            />
          </svg>
          Invoice
        </button>
      </div>
    </div>
  );
};
export default OrderHistoryItem;
