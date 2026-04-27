import Head from "next/head";
import { useState } from "react";

// types
import type { FC } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { FieldProps } from "formik";
import type { IOption } from "@/components/common/select-input.component";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import ProtectedLayout from "@/components/layout/protected-layout.component";

// local components
import SelectInput from "@/components/common/select-input.component";
import AlertPopup from "@/components/common/alert-popup.component";
import FAQItem from "@/components/profile/faq-item.component";

// external components
import { Formik, Form, Field } from "formik";

// api hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// icons
import { Pen } from "lucide-react";

// utils
import clsx from "clsx";

// data
import profile_faqs from "@/data/profile/faq.data";

type IExtendedFieldProps =
  | {
      type: "text" | "email" | "tel";
      name: string;
      label: string;
      placeholder?: string;
    }
  | {
      type: "select";
      name: string;
      label: string;
      placeholder: string;
      options: IOption[];
    };

const ExtendedField: FC<IExtendedFieldProps & { disabled?: boolean }> = (
  props,
) => {
  const { name, label, disabled } = props;

  return (
    <Field name={name}>
      {({ field, meta, form }: FieldProps) => {
        const hasError = meta.touched && meta.error;

        return (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-900">{label}</label>

            {/* INPUT */}
            {props.type !== "select" && (
              <input
                {...field}
                disabled={disabled}
                type={props.type}
                placeholder={props.placeholder}
                className={clsx(
                  "h-11 w-full rounded-lg border px-3 transition outline-none",
                  disabled && "cursor-not-allowed bg-gray-100",
                  hasError
                    ? "border-red-500"
                    : "border-gray-300 focus:border-orange-500",
                )}
              />
            )}

            {/* SELECT */}
            {props.type === "select" && (
              <SelectInput
                is_disabled={disabled}
                value={
                  props.options.find((o) => o.value === field.value)?.value ??
                  ""
                }
                options={props.options}
                onChange={(value) => form.setFieldValue(name, value)}
                placeholder={props.placeholder}
              />
            )}

            {hasError && <p className="text-xs text-red-500">{meta.error}</p>}
          </div>
        );
      }}
    </Field>
  );
};

type IAlertModalState = {
  open: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ProfilePage: NextPageWithLayout = () => {
  const [alert_popup_state, setAlertPopupState] = useState<IAlertModalState>({
    open: false,
  });
  const { data: user_details } = useUserDetails();
  const [is_editing, setIsEditing] = useState(false);

  const initial_values = {
    name: user_details?.name ?? "",
    email: user_details?.email ?? "",
    phone: user_details?.phone ?? "",
    gender: user_details?.gender ?? "male",
  };

  const openDeleteConfirmationModal = () => {
    return new Promise((resolve, reject) => {
      setAlertPopupState({
        open: true,
        onSuccess: () => {
          resolve("confirmed");
        },
        onCancel: () => {
          reject("rejected");
        },
      });
    });
  };

  return (
    <>
      <Head>
        <title>Your Account | Shopinger</title>
        <meta
          name="description"
          content="View and manage your account details securely on Shopinger."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AlertPopup
        title="Do you really want to delete this account?"
        open={alert_popup_state.open}
        handleAlertPopupState={(open) => {
          setAlertPopupState({
            open,
          });
        }}
        handleConfirmation={() => {
          alert_popup_state.onSuccess?.();
          setAlertPopupState({
            open: false,
          });
        }}
        handleCancellation={() => {
          alert_popup_state.onCancel?.();
          setAlertPopupState({
            open: false,
          });
        }}
      />
      <section className="min-h-screen w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="w-full rounded-xl border border-gray-300 bg-white">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
              <div>
                <h1 className="text-base font-semibold sm:text-xl">
                  Your Profile
                </h1>
                <p className="hidden text-sm text-gray-600 sm:block">
                  View and manage your personal information
                </p>
              </div>

              {!is_editing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-orange-500 hover:bg-orange-50 sm:border sm:border-orange-500"
                >
                  <span className="hidden font-semibold sm:inline-block">
                    Edit Profile
                  </span>
                  <Pen className="inline-block size-4 text-orange-500 sm:hidden" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="profile-form"
                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* FORM */}
            <Formik
              initialValues={initial_values}
              enableReinitialize
              onSubmit={(values) => {
                console.log("saved values:", values);
                setIsEditing(false);
              }}
            >
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
                  />

                  <ExtendedField
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    disabled={!is_editing}
                  />

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
                </div>

                {/* FAQ SECTION */}
                <div className="mt-10 border-t border-gray-200 pt-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    FAQs
                  </h2>

                  <div className="space-y-1">
                    {profile_faqs.map((faq, idx) => (
                      <FAQItem
                        key={idx}
                        question={faq.question}
                        answer={faq.answer}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-10 border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Danger Zone
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Permanently delete your account and all associated data.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      openDeleteConfirmationModal()
                        .then(() => {
                          console.log("got success");
                        })
                        .catch(() => {
                          console.log("got error");
                        });
                    }}
                    className="mt-4 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    Delete Account
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
