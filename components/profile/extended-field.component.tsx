import type { ChangeEvent, FC, ReactNode } from "react";
import type { FieldProps } from "formik";
import type { IOption } from "@/components/common/select-input.component";
import type { CountryCode } from "libphonenumber-js";
import type { IInitialValues } from "@/components/profile/profile-form.component";

// external components
import { Field } from "formik";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

// local components
import SelectInput from "@/components/common/select-input.component";
import CountrySelector from "@/components/login/country-selector.component";

// helpers
import { getCallingCode } from "@/helpers/common.helper";
import clsx from "clsx";

// icons
import { ChevronDown } from "lucide-react";

// hooks
import { useFormikContext } from "formik";

type IExtendedFieldProps =
  | {
      type: "text" | "email" | "tel" | "date";
      name: string;
      label: string;
      placeholder?: string;
      handleOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    }
  | {
      type: "select";
      name: string;
      label: string;
      placeholder: string;
      options: IOption[];
      handleOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    };

const ExtendedField: FC<
  IExtendedFieldProps & { disabled?: boolean; children?: ReactNode }
> = ({ children, ...props }) => {
  const { values } = useFormikContext<IInitialValues>();
  const { name, label, disabled, handleOnChange } = props;

  return (
    <Field name={name}>
      {({ field, meta, form }: FieldProps) => {
        const has_error = meta.touched && meta.error;
        const input_comp = () => {
          switch (true) {
            case props.type == "tel":
              return (
                <div className="flex w-full items-end gap-2">
                  <Popover className="relative">
                    <PopoverButton
                      disabled={disabled}
                      className="flex h-11 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
                    >
                      {getCallingCode(
                        (values["country"]?.code ?? "IN") as CountryCode,
                      )}
                      <ChevronDown className="size-4" />
                    </PopoverButton>

                    <PopoverPanel className="absolute z-20 mt-2 w-64 rounded-xl border bg-white shadow-lg">
                      {({ close }) => (
                        <div className="max-h-64 overflow-y-auto p-2">
                          <CountrySelector handleChange={() => close()} />
                        </div>
                      )}
                    </PopoverPanel>
                  </Popover>
                  <input
                    {...field}
                    disabled={disabled}
                    type={props.type}
                    onChange={(e) => {
                      field.onChange(e);
                      handleOnChange?.(e);
                    }}
                    placeholder={props.placeholder}
                    className={clsx(
                      "h-11 w-full rounded-lg border px-3 transition outline-none",
                      disabled && "cursor-not-allowed bg-gray-100",
                      has_error
                        ? "border-red-500"
                        : "border-gray-300 focus:border-2 focus:border-orange-500",
                    )}
                  />
                  {children}
                </div>
              );
            case props.type == "email":
              return (
                <div className="flex w-full items-end gap-2">
                  <input
                    {...field}
                    disabled={disabled}
                    type={props.type}
                    onChange={(e) => {
                      field.onChange(e);
                      handleOnChange?.(e);
                    }}
                    placeholder={props.placeholder}
                    className={clsx(
                      "h-11 w-full rounded-lg border px-3 transition outline-none",
                      disabled && "cursor-not-allowed bg-gray-100",
                      has_error
                        ? "border-red-500"
                        : "border-gray-300 focus:border-2 focus:border-orange-500",
                    )}
                  />
                  {children}
                </div>
              );
            case props.type == "select":
              return (
                <SelectInput
                  instance_id="gender-select"
                  is_disabled={disabled}
                  value={
                    props.options.find((o) => o.value === field.value)?.value ??
                    ""
                  }
                  options={props.options}
                  onChange={(value) => form.setFieldValue(name, value)}
                  placeholder={props.placeholder}
                />
              );
            default:
              return (
                <input
                  {...field}
                  disabled={disabled}
                  type={props.type}
                  onChange={(e) => {
                    field.onChange(e);
                    handleOnChange?.(e);
                  }}
                  placeholder={props.placeholder}
                  className={clsx(
                    "h-11 w-full rounded-lg border px-3 transition outline-none",
                    disabled && "cursor-not-allowed bg-gray-100",
                    has_error
                      ? "border-red-500"
                      : "border-gray-300 focus:border-2 focus:border-orange-500",
                  )}
                />
              );
          }
        };

        return (
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-gray-900">{label}</label>
            {input_comp()}
            {has_error && <p className="text-xs text-red-500">{meta.error}</p>}
          </div>
        );
      }}
    </Field>
  );
};

export default ExtendedField;
