// types
import type { FC } from "react";
import type { IAddressSnapshot } from "@/types/order";

// icons
import { MapPin, CreditCard, User, Copy, Map } from "lucide-react";

type IProps = {
  username: string;
  phone: string;
  country_code: number;
  payment_method: string;
  address_snapshot: IAddressSnapshot;
};

const OrderSummary: FC<IProps> = ({
  username,
  phone,
  country_code,
  payment_method,
  address_snapshot,
}) => {
  const {
    formatted_address,
    address_type,
    landmark,
    area,
    city,
    house_number,
    latitude,
    longitude,
  } = address_snapshot;
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-6">
      <h2 className="mb-6 font-semibold text-gray-900">Order Details</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Customer */}
        <div className="flex gap-3 rounded-lg border border-gray-300 p-4">
          <User className="mt-1 size-5 text-orange-500" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Customer</p>
            <p className="text-sm font-medium text-gray-900">
              {username ?? "Unknown User"}
              {phone ? ` / +${country_code} ${phone}` : ""}
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="flex gap-3 rounded-lg border border-gray-300 p-4">
          <CreditCard className="mt-1 size-5 text-orange-500" />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Payment Method
            </p>
            <p className="text-sm font-medium text-gray-900">
              {payment_method}
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg border border-gray-300 p-4 sm:col-span-2">
          <MapPin className="mt-1 size-5 text-orange-500" />

          <div className="w-full">
            {/* header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Delivery Address
                </p>
                <p className="text-xs font-medium text-gray-600">
                  {area}, {city}
                </p>
              </div>

              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                {address_type}
              </span>
            </div>

            {/* house number (high priority) */}
            {house_number && (
              <p className="mt-2 text-sm font-semibold text-gray-800">
                House / Flat: {house_number}
              </p>
            )}

            {/* full address */}
            <p className="mt-1 text-sm leading-relaxed font-medium text-gray-600">
              {formatted_address}
            </p>

            {/* landmark */}
            {landmark && (
              <p className="mt-2 text-sm font-medium text-gray-600">
                📍 Near {landmark}
              </p>
            )}

            {/* actions */}
            <div className="mt-3 flex gap-3">
              <button
                className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:underline"
                onClick={() => navigator.clipboard.writeText(formatted_address)}
              >
                <Copy className="size-3" strokeWidth={3} />
                Copy address
              </button>

              <button
                className="flex items-center gap-1 text-xs font-medium text-gray-900 hover:underline"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${latitude},${longitude}`,
                    "_blank",
                  )
                }
              >
                <Map className="h-3 w-3" />
                View on map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
