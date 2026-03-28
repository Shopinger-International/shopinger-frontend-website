// types
import type { FC } from "react";

// icons
import { HelpCircle } from "lucide-react";

type IProps = {
  title: string;
  description: string;
};
const HelpSection: FC<IProps> = ({ title, description }) => {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-5">
      <div className="flex items-start gap-3">
        <HelpCircle className="mt-1 size-6 text-orange-500" />

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>

          <p className="mt-1 text-sm font-medium text-gray-600">
            {description}
          </p>

          <button className="mt-3 font-medium text-orange-600 hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
export default HelpSection;
