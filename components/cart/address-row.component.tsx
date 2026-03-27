import type { FC } from "react";
import type { IAddress } from "@/types/address";

import { MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

// headless ui
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

import { typeIconMap } from "@/components/manage-address/address-card.component";

type AddressRowProps = {
  address: IAddress;
  onClick?: (address: IAddress) => void;
  is_selected?: boolean;
  onEdit?: (address: IAddress) => void;
  onDelete?: (address: IAddress) => void;
};

const AddressRow: FC<AddressRowProps> = ({
  address,
  onClick,
  is_selected,
  onEdit,
  onDelete,
}) => {
  const TypeIcon = typeIconMap[address.address_type] || MapPin;

  return (
    <div
      className={clsx(
        "flex cursor-pointer items-start justify-between gap-3 rounded-lg border px-4 py-3 transition-colors duration-200",
        is_selected
          ? "border-orange-500 bg-orange-50"
          : "border-transparent hover:bg-gray-100 active:bg-orange-100",
      )}
      onClick={() => onClick?.(address)}
      role="button"
      aria-pressed={is_selected}
    >
      {/* Left */}
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0">
          <TypeIcon className="h-5 w-5 text-orange-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
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

      {/* Right - 3 dot menu */}
      <Menu as="div" className="relative">
        <MenuButton
          className="rounded-md p-2 text-gray-600 hover:bg-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-5 w-5" />
        </MenuButton>

        <MenuItems
          className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-xl border border-gray-300 bg-white shadow-lg focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit */}
          <MenuItem>
            {({ active }) => (
              <button
                className={clsx(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm",
                  active && "bg-gray-100",
                )}
                onClick={() => onEdit?.(address)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
          </MenuItem>

          {/* Delete */}
          <MenuItem>
            {({ active }) => (
              <button
                className={clsx(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500",
                  active && "bg-red-50",
                )}
                onClick={() => onDelete?.(address)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default AddressRow;
