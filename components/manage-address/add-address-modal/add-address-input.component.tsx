// types
import type { FC } from "react";

// external components
import { Field, ErrorMessage } from "formik";

// helpers
import clsx from "clsx";
import { normalizePhone } from "@/helpers/common.helper";

// hooks
import { useFormikContext } from "formik";

type IProps = {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  options?: string[];
  helper?: string;
  disabled?: boolean;
  read_only?: boolean;
  handleOnClick?: () => void;
};

const AddAddressInput: FC<IProps> = ({
  type = "text",
  label,
  options,
  helper,
  disabled = false,
  read_only = false,
  handleOnClick,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
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
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-orange-500 disabled:bg-gray-50"
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
    case "tel":
      return (
        <div className="space-y-1.5">
          {label && <label className="font-medium">{label}</label>}

          <Field
            type={type}
            className={clsx(
              "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-orange-500 disabled:bg-gray-50",
              read_only && "bg-gray-50",
            )}
            onClick={handleOnClick}
            disabled={disabled}
            readOnly={read_only}
            {...props}
            autoComplete="tel"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = normalizePhone(e.target.value);
              setFieldValue(props.name, value);
            }}
          />

          {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}

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
            className={clsx(
              "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-orange-500 disabled:bg-gray-50",
              read_only && "bg-gray-50",
            )}
            onClick={handleOnClick}
            disabled={disabled}
            readOnly={read_only}
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
