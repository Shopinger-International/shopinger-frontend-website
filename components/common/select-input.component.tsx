import type { FC } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import clsx from "clsx";
import { capitalizeValue } from "@/helpers/common.helper";

export type IOption = {
  label: string;
  value: string;
};

type SelectInputProps = {
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  placeholder?: string;
  is_multi?: boolean;
  is_custom_allowed?: boolean;
  options: IOption[];
  updateOptions?: (options: IOption[]) => void;
  block_list?: Array<any>;
  is_disabled?: boolean;
  instance_id: string;
};

const SelectInput: FC<SelectInputProps> = ({
  value,
  onChange,
  placeholder,
  is_multi = false,
  is_custom_allowed = false,
  options,
  updateOptions,
  block_list = [],
  is_disabled,
  instance_id,
}) => {
  const SelectComponent = is_custom_allowed ? CreatableSelect : Select;

  const mapped_value = is_multi
    ? (value as string[])?.map((val) => ({
        label:
          options.find((o) => o.value === val)?.label ?? capitalizeValue(val),
        value: val,
      }))
    : value
      ? {
          label:
            options.find((o) => o.value === value)?.label ??
            capitalizeValue(value as string),
          value,
        }
      : null;

  return (
    <SelectComponent
      instanceId={instance_id}
      menuPosition="fixed"
      isOptionDisabled={(option) => block_list.includes(option.value)}
      unstyled
      placeholder={placeholder}
      isMulti={is_multi}
      options={options}
      value={mapped_value}
      isDisabled={is_disabled}
      onCreateOption={
        is_custom_allowed
          ? (input: string) => {
              const newOption = {
                label: input,
                value: input.toLowerCase(),
              };

              updateOptions?.([...options, newOption]);

              if (is_multi) {
                onChange([...(value as string[]), newOption.value]);
              } else {
                onChange(newOption.value);
              }
            }
          : undefined
      }
      onChange={(selected: any) => {
        if (is_multi) {
          onChange(selected ? selected.map((s: any) => s.value) : []);
        } else {
          onChange(selected ? selected.value : null);
        }
      }}
      classNames={{
        container: () => "w-full",
        control: ({ isFocused, isDisabled }) =>
          clsx(
            "flex w-full items-center rounded-md border px-3 py-2",
            isFocused ? "border-2 border-orange-500" : "border-gray-300",
            isDisabled && "cursor-not-allowed bg-gray-100",
          ),
        valueContainer: () => "flex gap-1 flex-wrap",
        placeholder: () => "text-gray-400",
        menu: () => "mt-2 rounded-md border border-gray-300 bg-white shadow-md",
        menuList: () => "max-h-60 overflow-y-auto py-2",
        option: ({ isFocused, isSelected, isDisabled }) =>
          clsx(
            "px-3 py-2 text-sm transition-colors",

            // Disabled state (always highest priority)
            isDisabled &&
              "cursor-not-allowed opacity-50 text-gray-400 bg-transparent",

            // Selected state
            !isDisabled && isSelected && "bg-orange-500 text-white",

            // Focused state
            !isDisabled &&
              !isSelected &&
              isFocused &&
              "bg-orange-100 cursor-pointer",

            // Default clickable state
            !isDisabled && !isSelected && !isFocused && "cursor-pointer",
          ),
        multiValue: () =>
          "flex items-center gap-1 rounded bg-orange-100 px-2 py-0.5",
        multiValueLabel: () => "text-sm text-orange-800",
        multiValueRemove: () =>
          "cursor-pointer text-orange-800 hover:text-white hover:bg-orange-500 rounded px-1",
      }}
    />
  );
};

export default SelectInput;
