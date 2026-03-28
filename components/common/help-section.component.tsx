import type { FC } from "react";
import { HelpCircle } from "lucide-react";

type IProps = {
  title: string;
  description: string;
};

const HelpSection: FC<IProps> = ({ title, description }) => {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-5">
      <div className="flex items-start gap-4">
        {/* Icon Badge */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
          <HelpCircle className="size-5 text-orange-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            {description}
          </p>

          {/* CTA */}
          <button className="mt-3 inline-flex items-center gap-1 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600">
            Get help
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
