import { useState } from "react";
// types
import type { FC } from "react";
import type { ICountry } from "@/data/countries.data";
import type { CountryCode } from "libphonenumber-js";
import type { IGender } from "@/types/user";

// data
import { countries } from "@/data/countries.data";

// external components
import { Formik, Form } from "formik";

// local components
import ExtendedField from "@/components/profile/extended-field.component";
import OTPModal from "@/components/common/otp-modal.component";

// api hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useSendOtpMutation from "@/hooks/axios/profile/use-send-otp-mutation.hook";
import useVerifyOtpMutation from "@/hooks/axios/profile/use-verify-otp-mutation.hook";
import useUpdateUserProfileMutation from "@/hooks/axios/profile/use-update-profile-mutation.hook";

// icons
import { Pen, Mail, Phone } from "lucide-react";

// helpers
import { getCallingCode, toFormikValidate } from "@/helpers/common.helper";
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

type IOTPModalState = {
  open: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  type?: "phone-otp" | "email-otp";
  identifier?: string;
  country_code?: number;
};

export type IInitialValues = {
  name: string;
  email: string;
  phone: string;
  gender: IGender;
  dob: string;
  country?: ICountry;
};

export const profile_validation_schema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z
      .string()
      .trim()
      .pipe(z.email({ message: "Enter a valid email" })),
    phone: z.string().trim().min(1, "Phone number is required"),

    gender: z.custom<IGender>((value) => {
      return ["male", "female", "other"].includes(value as string);
    }, "Select a valid gender"),

    dob: z.string().trim().min(1, "Date of birth is required"),

    country: z.custom<ICountry>((value) => {
      return typeof value === "object" && value !== null && "code" in value;
    }, "Select a country"),
  })
  .superRefine((data, ctx) => {
    const { phone, country } = data;

    const is_digit_only = /^\d+$/.test(phone);

    if (!is_digit_only) {
      ctx.addIssue({
        path: ["phone"],
        message: "Phone number should contain only digits",
        code: "custom",
      });

      return;
    }

    const phone_number = parsePhoneNumberFromString(
      phone,
      country.code as CountryCode,
    );

    if (!phone_number?.isValid()) {
      ctx.addIssue({
        path: ["phone"],
        message: "Enter a valid phone number",
        code: "custom",
      });
    }
  });

const ProfileForm: FC = () => {
  const update_user_profile_mutation = useUpdateUserProfileMutation();
  const send_otp_mutation = useSendOtpMutation();
  const verify_otp_mutation = useVerifyOtpMutation();
  const { data: user_details } = useUserDetails();
  const user_phone_number = user_details
    ? `+${user_details?.country_code}${user_details?.phone}`
    : null;
  const user_country_code =
    (user_phone_number &&
      parsePhoneNumberFromString(user_phone_number)?.country) ??
    "91";
  const [is_editing, setIsEditing] = useState(false);
  const [otp_modal_state, setOtpModalState] = useState<IOTPModalState>({
    open: false,
  });
  const [verification_flag, setVerificationFlag] = useState({
    is_email_verified: true,
    is_phone_verified: true,
  });
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string, country_code: CountryCode) => {
    const phoneNumber = parsePhoneNumberFromString(phone, country_code);
    return phoneNumber?.isValid() ?? false;
  };

  const initial_values: IInitialValues = {
    name: user_details?.name ?? "",
    email: user_details?.email ?? "",
    phone: user_details?.phone ?? "",
    gender: user_details?.gender ?? "male",
    dob: user_details?.dob ?? "",
    country: countries.find((country) => country.code == user_country_code) as
      | ICountry
      | undefined,
  };
  console.log("value of user phone number", user_phone_number);
  return (
    <>
      <OTPModal
        open={otp_modal_state.open}
        onResend={() => {
          send_otp_mutation.mutate({
            new_identifier: otp_modal_state.identifier as string,
          });
        }}
        handleSubmit={(otp) =>
          verify_otp_mutation.mutate(
            { otp },
            {
              onSuccess() {
                setVerificationFlag((prev) => ({
                  ...prev,
                  ...(otp_modal_state.type == "email-otp"
                    ? {
                        is_email_verified: true,
                      }
                    : { is_phone_verified: true }),
                }));

                setOtpModalState({
                  open: false,
                });
              },
            },
          )
        }
        is_pending={verify_otp_mutation.isPending}
        onClose={() => {
          setOtpModalState({
            open: false,
          });
        }}
      >
        {otp_modal_state.type == "email-otp" && (
          <div className="mb-6 flex flex-col items-center gap-2">
            <span className="shrink-0 rounded-full bg-orange-100 p-4">
              <Mail className="h-8 w-8 fill-orange-500 text-white" />
            </span>
            <h2 className="text-center text-2xl font-bold">Check your email</h2>
            <p className="jtext-gray-600 text-center">
              Enter the verification code sent to{" "}
              <span className="font-medium text-orange-500">
                {otp_modal_state.identifier}
              </span>
            </p>
          </div>
        )}
        {otp_modal_state.type == "phone-otp" && (
          <div className="mb-6 flex flex-col items-center gap-2">
            <span className="shrink-0 rounded-full bg-orange-100 p-4">
              <Phone className="h-8 w-8 fill-orange-500 text-white" />
            </span>
            <h2 className="text-center text-2xl font-bold">Check your Phone</h2>
            <p className="jtext-gray-600 text-center">
              Enter the verification code sent to{" "}
              <span className="font-medium text-orange-500">
                {otp_modal_state.identifier}
              </span>
            </p>
          </div>
        )}
      </OTPModal>
      <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
        <div>
          <h1 className="text-base font-semibold sm:text-xl">Your Profile</h1>
          <p className="hidden text-sm text-gray-600 sm:block">
            View and manage your personal information
          </p>
        </div>

        {!is_editing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-orange-500 hover:bg-orange-50 sm:border sm:border-orange-500"
          >
            <span className="hidden font-semibold sm:inline-block">
              Edit Profile
            </span>
            <Pen className="inline-block size-4 text-orange-500 sm:hidden" />
          </button>
        )}
      </div>
      <Formik
        initialValues={initial_values}
        validate={toFormikValidate(profile_validation_schema)}
        enableReinitialize
        onSubmit={({ country, ...values }) => {
          update_user_profile_mutation.mutate(
            {
              ...values,
              country_code: +getCallingCode(country?.code as CountryCode),
            },
            {
              onSuccess() {
                setIsEditing(false);
              },
            },
          );
        }}
      >
        {({ values }) => (
          <Form id="profile-form" className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ExtendedField
                type="text"
                name="name"
                label="Full Name"
                placeholder="Enter your name"
                disabled={!is_editing}
              />
              <ExtendedField
                type="tel"
                name="phone"
                label="Phone Number"
                placeholder="Enter your phone"
                disabled={!is_editing}
                handleOnChange={(e) => {
                  const updated_value = e.target.value;

                  setVerificationFlag((prev) => ({
                    ...prev,
                    is_phone_verified: updated_value == user_details?.phone,
                  }));
                }}
              >
                {!verification_flag.is_phone_verified &&
                  isValidPhone(
                    values["phone"],
                    (values["country"]?.code ?? "IN") as CountryCode,
                  ) && (
                    <button
                      type="button"
                      className="h-11 shrink-0 rounded-lg bg-orange-500 px-4 font-medium text-white"
                      onClick={() => {
                        send_otp_mutation.mutate(
                          {
                            new_identifier: values["phone"],
                            country_code: +getCallingCode(
                              (values["country"]?.code ?? "IN") as CountryCode,
                            ),
                          },
                          {
                            onSuccess() {
                              setOtpModalState({
                                open: true,
                                identifier: values["phone"],
                                country_code: +getCallingCode(
                                  (values["country"]?.code ??
                                    "IN") as CountryCode,
                                ),
                                type: "phone-otp",
                              });
                            },
                          },
                        );
                      }}
                    >
                      Send OTP
                    </button>
                  )}
              </ExtendedField>
              <ExtendedField
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                disabled={!is_editing}
                handleOnChange={(e) => {
                  const updated_value = e.target.value;
                  setVerificationFlag((prev) => ({
                    ...prev,
                    is_email_verified: updated_value == user_details?.email,
                  }));
                }}
              >
                {!verification_flag.is_email_verified &&
                  isValidEmail(values["email"]) && (
                    <button
                      type="button"
                      onClick={() => {
                        send_otp_mutation.mutate(
                          {
                            new_identifier: values["email"],
                          },
                          {
                            onSuccess() {
                              setOtpModalState({
                                open: true,
                                identifier: values["email"],
                                type: "email-otp",
                              });
                            },
                          },
                        );
                      }}
                      className="h-11 shrink-0 rounded-lg bg-orange-500 px-4 font-medium text-white"
                    >
                      Send OTP
                    </button>
                  )}
              </ExtendedField>

              <ExtendedField
                type="select"
                name="gender"
                label="Gender"
                placeholder="Select gender"
                disabled={!is_editing}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
              />
              <ExtendedField
                type="date"
                name="dob"
                label="Date of Birth"
                placeholder="Select your date of birth"
                disabled={!is_editing}
              />
            </div>
            {is_editing && (
              <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:bg-orange-300 sm:w-auto"
                  disabled={
                    !verification_flag.is_email_verified ||
                    !verification_flag.is_phone_verified ||
                    update_user_profile_mutation.isPending
                  }
                >
                  {update_user_profile_mutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
export default ProfileForm;
