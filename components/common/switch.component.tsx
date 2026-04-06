// types
import type { FC } from "react";

// external component
import { Switch as HeadlessSwitch, Field, Label } from "@headlessui/react";

// formik
import { useFormikContext } from "formik";

// helpers
import clsx from "clsx";

type IProps = {
  label: string;
  description?: string;
  name: string;
  disabled?: boolean;
};

const Switch: FC<IProps> = ({ label, description, name, disabled = false }) => {
  const { values, setFieldValue } = useFormikContext<any>();
  return (
    <Field className="flex items-center justify-between">
      <div>
        <Label className="font-medium">{label}</Label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>

      <HeadlessSwitch
        disabled={disabled}
        checked={values[name]}
        onChange={(value) => setFieldValue(name, value)}
        className={clsx(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:bg-orange-300",
          values[name] ? "bg-orange-500" : "bg-gray-300",
        )}
      >
        <span
          className={clsx(
            "inline-block h-4 w-4 transform rounded-full bg-white transition",
            values[name] ? "translate-x-6" : "translate-x-1",
          )}
        />
      </HeadlessSwitch>
    </Field>
  );
};
export default Switch;
