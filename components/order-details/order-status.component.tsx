// type
import type { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

type IProps = {
  label: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const OrderStatus: FC<IProps> = ({ label, description, icon: Icon }) => {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl bg-white p-2 pr-3">
      <div className="rounded-md border border-gray-300 p-1">
        <Icon className="size-5 text-orange-500" />
      </div>
      {/* Text content */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        <span className="text-xs text-gray-600">{description}</span>
      </div>
    </div>
  );
};
export default OrderStatus;
