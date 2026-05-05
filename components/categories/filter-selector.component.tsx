import type { FC } from "react";

// icons
import { ChevronDown, ChevronUp } from "lucide-react";

// local components
import Checkbox from "@/components/common/checkbox.component";

// helpers
import clsx from "clsx";

type IProps = {
  label: string;
  code: string;
  is_open: boolean;
  handleOpen: (attribute_name: string) => void;
  handleOptionChange: (
    attribute_code: string,
    option_value: string,
    is_enabled: boolean,
  ) => void;
  options: {
    label: string;
    is_enabled: boolean;
    value: string;
  }[];
};

const FilterSelector: FC<IProps> = ({
  label,
  code,
  is_open,
  options,
  handleOpen,
  handleOptionChange,
}) => {
  return (
    <section
      className={clsx(
        "border-b border-gray-300 select-none",
        clsx(is_open && "pb-4"),
      )}
    >
      <div
        className="mb-4 flex w-full items-center justify-between"
        onClick={() => handleOpen(code)}
      >
        <h3 className="text-sm font-semibold text-orange-500">{label}</h3>

        {is_open ? (
          <ChevronUp className="size-4 text-gray-600" />
        ) : (
          <ChevronDown className="size-4 text-gray-600" />
        )}
      </div>

      {is_open && (
        <div>
          {options.map(({ label, is_enabled, value }, index) => {
            return (
              <Checkbox
                enabled={is_enabled}
                onChange={() => handleOptionChange(code, value, !is_enabled)}
                label={label}
                key={`filter-option-${index}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FilterSelector;
