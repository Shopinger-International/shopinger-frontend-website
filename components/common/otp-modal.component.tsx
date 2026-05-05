// types
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";

// external components
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
  Field,
} from "@headlessui/react";
import { Formik } from "formik";

// local components
import OTPInput from "@/components/common/otp-input.component";

// helpers
import clsx from "clsx";
import { z } from "zod";
import { toFormikValidate } from "@/helpers/common.helper";

// icons
import { X } from "lucide-react";

const otp_verification_validation_schema = z.object({
  otp: z
    .string()
    .min(6, "OTP should be six digit")
    .max(6, "OTP should be six digit"),
});

interface OTPModalProps {
  open: boolean;
  is_pending: boolean;
  onClose: () => void;
  onResend: () => void;
  handleSubmit: (otp: string) => void;
  children: ReactNode;
}

const OTPModal: FC<OTPModalProps> = ({
  open,
  is_pending,
  onClose,
  onResend,
  handleSubmit,
  children,
}) => {
  const [timer, setTimer] = useState(60);

  // countdown
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="relative mx-4 w-full max-w-sm rounded-xl border border-gray-300 bg-white p-8 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setTimer(60); // reset timer
              onClose(); // close modal
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
          <DialogTitle>{children}</DialogTitle>

          <Formik
            initialValues={{
              otp: "",
            }}
            validate={toFormikValidate(otp_verification_validation_schema)}
            onSubmit={(values) => {
              handleSubmit(values["otp"]);
            }}
          >
            {({ values, setFieldValue, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field>
                  <OTPInput
                    value={values.otp}
                    onChange={(val) => {
                      console.log("value of otp", val);
                      if (/^\d*$/.test(val)) {
                        setFieldValue("otp", val);
                      }
                    }}
                    maxLength={6}
                    containerClassName="flex gap-2"
                  />
                </Field>

                {/* Timer + Resend */}
                <div className="my-4 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={timer !== 0}
                    onClick={() => {
                      onResend();
                      setFieldValue("otp", "");
                      setTimer(60);
                    }}
                    className={`text-sm ${
                      timer === 0
                        ? "text-orange-500 hover:text-orange-600"
                        : "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Resend OTP
                  </button>
                  <span className="text-sm text-gray-500">
                    Resend in {timer}s
                  </span>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className={clsx(
                    "w-full rounded-md bg-orange-500 py-3 font-bold text-white transition duration-300",
                    "hover:bg-orange-600 hover:shadow-md",
                    "disabled:bg-orange-300",
                  )}
                  disabled={is_pending || values["otp"].length < 6}
                >
                  {is_pending ? "Verifying..." : "Verify"}
                </button>
              </form>
            )}
          </Formik>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default OTPModal;
