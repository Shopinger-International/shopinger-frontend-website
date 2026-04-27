import Head from "next/head";
import { useState, FC } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { FieldProps } from "formik";
import type { IOption } from "@/components/common/select-input.component";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import ProtectedLayout from "@/components/layout/protected-layout.component";

// components
import SelectInput from "@/components/common/select-input.component";

// formik
import { Formik, Form, Field } from "formik";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// utils
import clsx from "clsx";

/* ---------------- TYPES ---------------- */

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

/* ---------------- FIELD COMPONENT ---------------- */

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
            <label className="text-sm font-medium">{label}</label>

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
                    : "border-gray-300 focus:border-2 focus:border-orange-500",
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

/* ---------------- PAGE ---------------- */

const ProfilePage: NextPageWithLayout = () => {
  const { data: user_details } = useUserDetails();
  const [isEditing, setIsEditing] = useState(false);

  const initial_values = {
    name: user_details?.name ?? "",
    email: user_details?.email ?? "",
    phone: user_details?.phone ?? "",
    gender: user_details?.gender ?? "male",
  };

  return (
    <>
      <Head>
        <title>Your Account | Shopinger</title>

        <meta
          name="description"
          content="View and manage your account details, orders, addresses, and settings securely on Shopinger."
        />

        <meta
          name="keywords"
          content="user account, profile, orders, addresses, account settings, Shopinger"
        />

        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <section className="min-h-screen w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="w-full rounded-xl border border-gray-300 bg-white">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
              <div>
                <h1 className="text-xl font-semibold">Your Profile</h1>
                <p className="text-sm text-gray-500">
                  View and manage your personal information
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="profile-form"
                    className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
                  >
                    Save details
                  </button>
                </div>
              )}
            </div>

            {/* FORM */}
            <Formik
              initialValues={initial_values}
              enableReinitialize
              onSubmit={(values) => {
                console.log("save values:", values);
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
                    disabled={!isEditing}
                  />

                  <ExtendedField
                    type="tel"
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter your phone"
                    disabled={!isEditing}
                  />

                  <ExtendedField
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    disabled={!isEditing}
                  />

                  <ExtendedField
                    type="select"
                    name="gender"
                    label="Gender"
                    placeholder="Select gender"
                    disabled={!isEditing}
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                  />
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
