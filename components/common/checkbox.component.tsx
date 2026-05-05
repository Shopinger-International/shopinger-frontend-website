import type { FC } from "react";

// external component
import { Checkbox as HeadlessCheckbox, Field, Label } from "@headlessui/react";

type IProps = {
  enabled: boolean;
  label: string;
  onChange: (val: boolean) => void;
};
const Checkbox: FC<IProps> = ({ enabled, label, onChange }) => {
  return (
    <Field className="flex cursor-pointer items-center gap-2 py-1">
      <HeadlessCheckbox
        checked={enabled}
        onChange={onChange}
        className="group flex size-5 shrink-0 items-center justify-center rounded border border-gray-300 bg-white outline-none data-checked:border-orange-500 data-checked:bg-orange-500"
      >
        <svg
          className="stroke-white opacity-0 group-data-checked:opacity-100"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </HeadlessCheckbox>

      <Label className="cursor-pointer truncate text-sm font-medium text-gray-900">
        {label}
      </Label>
    </Field>
  );
};

export default Checkbox;
