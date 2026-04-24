// types
import type { FC } from "react";
import type IUser from "@/types/user";
import type { FieldProps } from "formik";

// external components
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";

// icons
import { X } from "lucide-react";

// api hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useReportReviewMutation from "@/hooks/axios/review/use-report-review-mutation.hook";

// helpers
import { z } from "zod";
import { toFormikValidate } from "@/helpers/common.helper";

export type IReason = "OFF_TOPIC" | "INAPPROPRIATE" | "FAKE" | "OTHER";
type IInitialValues = {
  reason: IReason | "";
  description: string;
};

export const report_schema = z
  .object({
    reason: z
      .enum(
        ["OFF_TOPIC", "INAPPROPRIATE", "FAKE", "OTHER"],
        "Please select a reason",
      )
      .optional(),
    description: z
      .string()
      .max(300, "Description must be at most 300 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    // reason required
    if (!data.reason) {
      ctx.addIssue({
        code: "custom",
        message: "Please select a reason",
        path: ["reason"],
      });
    }

    // description required only for OTHER
    if (data.reason === "OTHER") {
      if (!data.description || !data.description.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Description is required when selecting",
          path: ["description"],
        });
      }
    }
  });

const reasons: Array<{
  label: string;
  value: IReason;
}> = [
  {
    label: "Off Topic",
    value: "OFF_TOPIC",
  },
  {
    label: "Inappropriate",
    value: "INAPPROPRIATE",
  },
  {
    label: "Fake",
    value: "FAKE",
  },
  {
    label: "Other",
    value: "OTHER",
  },
];

type IProps = {
  review_id: number;
  is_open: boolean;
  onClose: () => void;
  handleLogin: () => Promise<IUser>;
};

const ReportModal: FC<IProps> = ({
  review_id,
  is_open,
  onClose,
  handleLogin,
}) => {
  const report_review_mutation = useReportReviewMutation();
  const { data: user_details } = useUserDetails();
  const is_logged_in = !!user_details;
  return (
    <Dialog open={is_open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" />

      {/* Center */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="flex w-full max-w-sm flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-6 py-3">
            <DialogTitle className="text-base font-semibold text-gray-900">
              Report review
            </DialogTitle>

            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <Formik<IInitialValues>
            initialValues={{
              reason: "",
              description: "",
            }}
            onSubmit={async ({ description, ...values }) => {
              if (is_logged_in) {
                report_review_mutation.mutate(
                  {
                    review_id,
                    reason: values.reason as IReason,
                    ...(description
                      ? {
                          description,
                        }
                      : {}),
                  },
                  {
                    onSuccess() {
                      onClose();
                    },
                  },
                );
              } else {
                handleLogin()
                  .then((user) => {
                    if (user) {
                      report_review_mutation.mutate({
                        review_id,
                        reason: values.reason as IReason,
                        ...(description
                          ? {
                              description,
                            }
                          : {}),
                      });
                    }
                    onClose();
                  })
                  .catch((err) => {});
              }
            }}
            validate={toFormikValidate(report_schema)}
          >
            {({ values, setFieldValue }) => (
              <Form className="flex flex-1 flex-col">
                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    Why are you reporting this?
                  </p>

                  <ul className="mt-3 space-y-3">
                    {reasons.map(({ value, label }, index) => {
                      const active = values.reason === value;

                      return (
                        <li key={`reason-${index}`}>
                          <button
                            type="button"
                            onClick={() => setFieldValue("reason", value)}
                            className={`flex w-full items-center gap-3 text-left text-sm transition outline-none`}
                          >
                            <span
                              className={`size-4 rounded-full transition ${
                                active
                                  ? "bg-orange-500"
                                  : "border-2 border-gray-400"
                              }`}
                            />

                            {/* Label */}
                            <span>{label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <ErrorMessage
                    name="reason"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                  {values.reason === "OTHER" && (
                    <>
                      <Field name="description">
                        {({ field }: FieldProps<string, IInitialValues>) => (
                          <div className="mt-4 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-900">
                              Describe the issue
                            </label>

                            <p className="text-xs text-gray-500">
                              Please explain why you're reporting this review.
                              This helps us take the right action.
                            </p>

                            <textarea
                              {...field}
                              rows={4}
                              maxLength={300}
                              placeholder="Explain the issue clearly (e.g., misleading information, spam, abuse, etc.)"
                              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-orange-500"
                            />

                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Required</span>
                              <span>{field.value?.length || 0}/300</span>
                            </div>
                          </div>
                        )}
                      </Field>

                      <ErrorMessage
                        name={"description"}
                        component="p"
                        className="mt-1 text-sm text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-300 px-6 py-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-900"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                  >
                    Submit Report
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ReportModal;
