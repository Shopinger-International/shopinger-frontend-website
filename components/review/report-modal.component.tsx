import { useEffect, useState } from "react";
import type { FC } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

type IProps = {
  is_open: boolean;
  onClose: () => void;
  reviewTitle?: string;
  onSubmit: (data: { reason: string; note?: string }) => Promise<void>;
};

const reasons = [
  "Spam or misleading",
  "Hate speech or abuse",
  "Fake or incentivized review",
  "Irrelevant to product",
  "Other",
];

const ReportModal: FC<IProps> = ({
  is_open,
  onClose,
  reviewTitle,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const isOther = reason === "Other";

  // reset when closed
  useEffect(() => {
    if (!is_open) {
      setReason("");
      setNote("");
      setLoading(false);
    }
  }, [is_open]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onSubmit({
        reason,
        note: note?.trim() || undefined,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={is_open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Center */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl bg-white shadow-xl">
          
          {/* Header */}
          <div className="border-b p-5">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Report review
            </DialogTitle>

            {reviewTitle && (
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                “{reviewTitle}”
              </p>
            )}
          </div>

          {/* Body */}
          <div className="p-5">
            <p className="text-sm text-gray-600">
              Help us understand what’s wrong with this review
            </p>

            {/* Reasons */}
            <div className="mt-4 space-y-2">
              {reasons.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="report_reason"
                    value={item}
                    checked={reason === item}
                    onChange={() => setReason(item)}
                    className="accent-orange-500"
                  />
                  {item}
                </label>
              ))}
            </div>

            {/* Optional textarea */}
            {isOther && (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tell us more..."
                className="mt-4 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                rows={3}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t p-4">
            <button
              className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              disabled={!reason || loading}
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              onClick={handleSubmit}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ReportModal;