import { FC } from "react";
import type { IAddress } from "@/types/address";

// icons
import { Home, Briefcase, MapPin, Phone } from "lucide-react";

// helpers
import clsx from "clsx";

const typeIconMap = {
  home: Home,
  work: Briefcase,
  other: MapPin,
};

type IBaseProps = {
  data: IAddress;
  onEdit?: () => void;
  onDelete?: () => void;
};

type IWithSelection = {
  show_selected: true;
  selected_address_id: number | null;
  updateSelectedAddress: (address_id: number) => void;
};

type IWithoutSelection = {
  show_selected: false;
  selected_address_id?: never;
  updateSelectedAddress?: never;
};

type IProps = IBaseProps & (IWithSelection | IWithoutSelection);
const AddressCard: FC<IProps> = ({
  data,
  onEdit,
  onDelete,
  show_selected,
  selected_address_id,
  updateSelectedAddress,
}) => {
  const TypeIcon = typeIconMap[data.address_type] || MapPin;
  console.log(
    "value of selected address id",
    selected_address_id,
    show_selected,
  );
  return (
    <div
      className={clsx(
        "group relative w-full cursor-pointer rounded-xl border bg-white p-6 md:w-xs",
        show_selected && data.id == selected_address_id
          ? "border-2 border-orange-500"
          : "border-gray-300",
      )}
      onClick={() => updateSelectedAddress?.(data.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <TypeIcon className="h-5 w-5 text-orange-500" />

          <h3 className="text-sm font-semibold text-gray-900">
            {data.full_name}
          </h3>

          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 capitalize">
            {data.address_type}
          </span>
        </div>

        {data.is_default && (
          <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            Default
          </span>
        )}
      </div>

      {/* ADDRESS */}
      <div className="mt-3 space-y-1 text-sm text-gray-900">
        <p className="font-medium text-gray-900">
          {data.house_number}, {data.address1}
        </p>

        <p>
          {data.city}, {data.state} - {data.zip}
        </p>

        {data.landmark && (
          <p className="text-xs text-gray-600">Near {data.landmark}</p>
        )}
      </div>

      {/* DELIVERY NOTE */}
      {data.delivery_instructions && (
        <p className="mt-2 text-xs text-gray-600 italic">
          “{data.delivery_instructions}”
        </p>
      )}

      {/* PHONE */}
      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Phone className="h-4 w-4" />
        {data.phone}
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="font-medium text-gray-600 hover:text-black"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="font-medium text-gray-600 hover:text-black"
        >
          Delete
        </button>

        {!data.is_default && (
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="font-medium text-gray-600 hover:text-black"
          >
            Set as default
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
