// types
import type { FC } from "react";

// external components
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Formik, Form } from "formik";

// icons
import { X } from "lucide-react";

type IInitialValues = {
  reason: string;
};

type IProps = {
  is_open: boolean;
  onClose: () => void;
  reviewTitle?: string;
};

const reasons = [
  "Spam or misleading",
  "Hate speech or abuse",
  "Fake or incentivized review",
  "Irrelevant to product",
  "Other",
];

const ReportModal: FC<IProps> = ({ is_open, onClose }) => {
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
            }}
            onSubmit={(values) => {
              console.log("value of values", values);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="flex flex-1 flex-col">
                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    Why are you reporting this?
                  </p>

                  <ul className="mt-3 space-y-3">
                    {reasons.map((reason, index) => {
                      const active = values.reason === reason;

                      return (
                        <li key={`reason-${index}`}>
                          <button
                            type="button"
                            onClick={() => setFieldValue("reason", reason)}
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
                            <span>{reason}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
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
