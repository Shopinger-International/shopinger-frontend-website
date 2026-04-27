import { useFormikContext } from "formik";
// types
import type { FC, ChangeEventHandler } from "react";

// external component
import {
  Input,
  Button,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

// icons
import { ChevronDownIcon } from "lucide-react";

// clsx
import clsx from "clsx";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// helpers
import axios from "axios";
import { normalizeText } from "@/helpers/common.helper";

const ProfileInputField: FC<{
  type: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled: boolean;
  placeholder: string;
  verification_flag: {
    email_verification: boolean;
    phone_verification: boolean;
  };
  handleShowOtpModal: (
    name: "email_modal" | "phone_modal",
    value: boolean,
  ) => void;
  handleOTPData: (name: "email" | "phone", value: boolean) => void;
  handleVerificationFlag: (name: string, value: boolean) => void;
}> = ({
  type,
  name,
  disabled,
  onChange,
  placeholder,
  verification_flag,
  handleShowOtpModal,
  handleOTPData,
  handleVerificationFlag,
}) => {
  const query_client = useQueryClient();
  const { values, setFieldValue, setValues } = useFormikContext();
  const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  switch (name) {
    case "gender":
      return (
        <Listbox
          name={name}
          value={values[name] ?? ""}
          disabled={disabled}
          onChange={(value) => setFieldValue("gender", value)}
        >
          <ListboxButton
            className={clsx(
              "flex w-full items-center justify-between rounded-md border px-3 py-2 transition-all",
              "min-h-10 border-gray-300 text-gray-700 shadow-sm",
              disabled ? "bg-orange-50" : "bg-white",
            )}
          >
            <span>
              {values[name]
                ? values[name][0].toUpperCase() +
                  values[name].slice(1).toLowerCase()
                : disabled
                  ? ""
                  : placeholder}
            </span>
            {!disabled && <ChevronDownIcon className="h-4 w-4 text-gray-500" />}
          </ListboxButton>

          <ListboxOptions
            anchor="bottom"
            className="w-[var(--button-width)] rounded-md border border-gray-200 bg-white py-2 shadow-lg [--anchor-gap:8px]"
          >
            {[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ].map(({ label, value }) => (
              <ListboxOption
                key={value}
                value={value}
                className={({ active, selected }) =>
                  clsx(
                    "cursor-pointer px-3 py-2 transition",
                    active && "bg-orange-50 text-orange-600",
                    selected && "bg-orange-500 font-medium text-white",
                  )
                }
              >
                {label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      );
    case "phone":
      return (
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={values[name] ?? ""}
            name={name}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={clsx(
              "w-full rounded-md border border-gray-300 px-3 py-2",
              disabled ? "bg-orange-50" : "bg-white",
            )}
          />
          {values[name].length == 10 &&
            !verification_flag.phone_verification && (
              <Button
                className={
                  "cursor-pointer rounded-lg bg-orange-500 px-5 py-2 font-medium whitespace-nowrap text-white shadow-sm hover:bg-orange-600 hover:shadow-md disabled:bg-orange-300"
                }
                disabled={send_otp_mutation.isPending}
                onClick={() => {
                  send_otp_mutation.mutate({
                    newIdentifier: values[name],
                    modal_type: "phone_modal",
                  });
                  handleOTPData("phone", values[name]);
                }}
              >
                {send_otp_mutation.isPending ? "Sending" : "Send OTP"}
              </Button>
            )}
        </div>
      );

    case "email":
      return (
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={values[name] ?? ""}
            name={name}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={clsx(
              "w-full rounded-md border border-gray-300 px-3 py-2",
              disabled ? "bg-orange-50" : "bg-white",
            )}
          />
          {email_regex.test(values[name]) &&
            !verification_flag.email_verification && (
              <Button
                className={
                  "cursor-pointer rounded-lg bg-orange-500 px-5 py-2 font-medium whitespace-nowrap text-white shadow-sm hover:bg-orange-600 hover:shadow-md disabled:bg-orange-300"
                }
                disabled={send_otp_mutation.isPending}
                onClick={() => {
                  send_otp_mutation.mutate({
                    newIdentifier: values[name],
                    modal_type: "email_modal",
                  });
                  handleOTPData("email", values[name]);
                }}
              >
                {send_otp_mutation.isPending ? "Sending" : "Send OTP"}
              </Button>
            )}
        </div>
      );

    default:
      return (
        <Input
          type={type}
          value={values[name] ?? ""}
          name={name}
          onChange={onChange}
          disabled={disabled}
          placeholder={disabled ? "" : placeholder}
          className={clsx(
            "w-full rounded-md border border-gray-300 px-3 py-2",
            disabled ? "bg-orange-50" : "bg-white",
          )}
        />
      );
  }
};
export default ProfileInputField;
