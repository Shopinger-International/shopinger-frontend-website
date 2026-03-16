// types
import type { FC } from "react";

// external components
import { Field, ErrorMessage } from "formik";

type IProps = {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  options?: string[];
  helper?: string;
  disabled?: boolean;
};

const AddAddressInput: FC<IProps> = ({
  type = "text",
  label,
  options,
  helper,
  disabled = false,
  ...props
}) => {
  switch (type) {
    case "checkbox":
      return (
        <label className="flex items-center gap-2">
          <Field type="checkbox" {...props} />
          disabled={disabled}
          <span className="text-sm">{label}</span>
        </label>
      );

    case "textarea":
      return (
        <div className="space-y-1.5">
          {label && <label className="font-medium">{label}</label>}

          <Field
            as="textarea"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-50"
            disabled={disabled}
            {...props}
          />

          <ErrorMessage
            name={props.name}
            component="p"
            className="text-sm text-red-500"
          />
        </div>
      );

    default:
      return (
        <div className="space-y-1.5">
          {label && <label className="font-medium">{label}</label>}

          <Field
            type={type}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-50"
            disabled={disabled}
            {...props}
          />

          {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}

          <ErrorMessage
            name={props.name}
            component="p"
            className="text-sm text-red-500"
          />
        </div>
      );
  }
};

export default AddAddressInput;
