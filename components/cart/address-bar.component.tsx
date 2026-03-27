// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";

// icons
import { MapPin } from "lucide-react";

// helpers
import clsx from "clsx";

type AddressBarProps = {
  address: IAddress | null;
  handleShowAddressDrawer: () => void;
};

const AddressBar: FC<AddressBarProps> = ({
  address,
  handleShowAddressDrawer,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4",
      )}
    >
      <div className="flex items-start gap-3">
        <MapPin className="mt-1 size-5 text-orange-500" />

        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900">
            Deliver to {address?.full_name || "Select Address"}
          </p>

          <p className="line-clamp-1 text-sm font-medium text-gray-600">
            {address
              ? `${address.house_number}, ${address.area}, ${address.city}`
              : "Choose your delivery location"}
          </p>
        </div>
      </div>
      <button
        className="cursor-pointer rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
        onClick={handleShowAddressDrawer}
      >
        Change
      </button>
    </div>
  );
};

export default AddressBar;
