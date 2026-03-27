// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";

// icons
import { MapPin } from "lucide-react";

// helpers
import clsx from "clsx";

// const
import { typeIconMap } from "@/components/manage-address/address-card.component";

type AddressRowProps = {
  address: IAddress;
  onClick?: (address: IAddress) => void;
  is_selected?: boolean;
};

const AddressRow: FC<AddressRowProps> = ({ address, onClick, is_selected }) => {
  const TypeIcon = typeIconMap[address.address_type] || MapPin;

  return (
    <div
      className={clsx(
        "flex cursor-pointer items-start gap-4 rounded-lg border px-4 py-3 transition-colors duration-200",
        is_selected
          ? "border-orange-500 bg-orange-50"
          : "border-transparent hover:bg-gray-100 active:bg-orange-100",
      )}
      onClick={() => onClick?.(address)}
      role="button"
      aria-pressed={is_selected}
    >
      {/* Address icon */}
      <div className="mt-1 shrink-0">
        <TypeIcon className="h-5 w-5 text-orange-500" />
      </div>

      {/* Address info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-row items-center justify-between gap-1">
          <p className="text-sm font-semibold">{address.full_name}</p>
          {address.is_default && (
            <span className="rounded-full border border-orange-500 bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-500">
              Default
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600">{address.area}</p>
        <p className="text-sm text-gray-600">
          {address.city}, {address.state} - {address.pincode}
        </p>
      </div>
    </div>
  );
};

export default AddressRow;
