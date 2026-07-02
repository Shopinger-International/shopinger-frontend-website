import { useContext } from "react";
// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";

// icons
import { MapPin } from "lucide-react";

// helpers
import clsx from "clsx";

// context
import { AddressDrawerState } from "@/context";

type AddressBarProps = {
  address: IAddress | null;
};

const AddressBar: FC<AddressBarProps> = ({
  address,
}) => {
  const { is_modal_open, address_id, updateState } =
    useContext(AddressDrawerState);
  return (
    <div
      className={clsx(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        "rounded-xl border border-gray-300 bg-white p-3 sm:p-4",
      )}
    >
      <div className="flex items-start gap-3">
        <MapPin className="mt-1 size-5 shrink-0 text-orange-500" />

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
        className="w-full cursor-pointer rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] sm:w-auto"
        onClick={() =>
          updateState?.({
            address_id,
            is_modal_open,
            open: true,
          })
        }
      >
        Change
      </button>
    </div>
  );
};

export default AddressBar;
