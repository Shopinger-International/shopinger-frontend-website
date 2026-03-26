import { FC } from "react";
import type { IAddress } from "@/types/address";

// icons
import { Home, Briefcase, MapPin, Phone } from "lucide-react";

// helpers
import clsx from "clsx";

// hooks
import useDeleteAddressMutation from "@/hooks/axios/address/use-delete-address-mutation.hook";
import useUpdateAddressMutation from "@/hooks/axios/address/use-update-address-mutation.hook";

const typeIconMap = {
  HOME: Home,
  WORK: Briefcase,
  OTHER: MapPin,
};

type IProps = {
  data: IAddress;
  onEdit?: (data: IAddress) => void;
  onDelete?: () => void;
};
const AddressCard: FC<IProps> = ({ data, onEdit }) => {
  const delete_address_mutation = useDeleteAddressMutation();
  const update_address_mutation = useUpdateAddressMutation();
  const TypeIcon = typeIconMap[data.address_type] || MapPin;
  return (
    <div
      className={clsx(
        "group relative w-full cursor-pointer rounded-xl border border-gray-300 bg-white p-6 md:w-xs",
      )}
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
          {data.house_number}, {data.area}
        </p>

        <p>
          {data.city}, {data.state} - {data.pincode}
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
            onEdit?.(data);
          }}
          className="cursor-pointer font-medium text-gray-600 hover:text-black"
        >
          Edit
        </button>

        {!data.is_default && (
          <button
            type="button"
            onClick={(e) => {
              delete_address_mutation.mutate({
                address_id: data.id,
              });
            }}
            disabled={delete_address_mutation.isPending}
            className="cursor-pointer font-medium text-gray-600 hover:text-black disabled:text-gray-300"
          >
            Delete
          </button>
        )}

        {!data.is_default && (
          <button
            onClick={() => {
              update_address_mutation.mutate({
                address_id: data.id,
                payload: {
                  ...data,
                  is_default: true,
                },
              });
            }}
            disabled={update_address_mutation.isPending}
            className="font-medium text-gray-600 hover:text-black disabled:text-gray-600"
          >
            Set as default
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
