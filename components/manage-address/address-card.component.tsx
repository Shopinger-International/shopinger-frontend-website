import { FC } from "react";

type Address = {
  id: string;
  name: string;
  address: string;
  phone: string;
  type?: "home" | "work" | "other";
  isDefault?: boolean;
};

type Props = {
  data: Address;
  onEdit?: () => void;
  onDelete?: () => void;
};

const AddressCard: FC<Props> = ({ data, onEdit, onDelete }) => {
  return (
    <div
      className={`group relative w-sm cursor-pointer space-y-2 rounded-xl border border-gray-300 p-6`}
    >
      {/* NAME + TYPE */}
      <div className="flex items-center gap-3">
        <h3 className="text-md font-semibold text-gray-900">{data.name}</h3>

        {data.type && (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 capitalize">
            {data.type}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed">{data.address}</p>
      <p className="text-sm">{data.phone}</p>
      <div className="flex items-center gap-4 divide-gray-200 text-sm text-gray-500">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="flex items-center gap-1 hover:text-gray-700"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="flex items-center gap-1 text-red-500 hover:text-red-600"
        >
          Delete
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center gap-1 hover:text-orange-600"
        >
          Set default
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
