import type { FC } from "react";
import type { IAddress } from "@/types/address";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import { typeIconMap } from "../manage-address/address-card.component";

type AddressRowProps = {
  address: IAddress;
  onClick?: (address: IAddress) => void;
  isSelected?: boolean;
};

const AddressRow: FC<AddressRowProps> = ({ address, onClick, isSelected }) => {
  const TypeIcon = typeIconMap[address.address_type] || MapPin;

  return (
    <div
      className={clsx(
        "flex cursor-pointer items-start gap-4 rounded-lg border px-4 py-3 transition-colors duration-200",
        isSelected ? "border-orange-500 bg-orange-50" : "border-transparent",
        "hover:bg-gray-100 active:bg-orange-100",
      )}
      onClick={() => onClick?.(address)}
      role="button"
      aria-pressed={isSelected}
    >
      {/* Address icon */}
      <div className="mt-1 shrink-0">
        <TypeIcon className="h-5 w-5 text-orange-500" />
      </div>

      {/* Address info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">{address.full_name}</p>
          {address.is_default && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
              Default
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600">{address.area}</p>
        <p className="text-sm text-gray-500">
          {address.city}, {address.state} - {address.pincode}
        </p>
      </div>
    </div>
  );
};

export default AddressRow;
