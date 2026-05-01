import type { FC } from "react";
import { MapPin, CreditCard, User, Phone } from "lucide-react";

// api hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

type IProps = {
  username: string;
  phone: string;
  payment_method: string;
  delivery_address: string;
};

const OrderSummary: FC<IProps> = ({
  username,
  phone,
  payment_method,
  delivery_address,
}) => {
  const { data: user } = useUserDetails();
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
              {username ?? phone}
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

        {/* Delivery Address (more important → full width) */}
        <div className="flex gap-3 rounded-lg border border-gray-300 p-4 sm:col-span-2">
          <MapPin className="mt-1 size-5 text-orange-500" />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Delivery Address
            </p>
            <p className="text-sm text-gray-600">{delivery_address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
