// types
import type { FC } from "react";

// helpers
import clsx from "clsx";

// icons
import { FileText } from "lucide-react";

type IProps = {
  total_amount: number;
  total_discount: number;
  charges: number;
};

const BillSummary: FC<IProps> = ({ total_amount, total_discount, charges }) => {
  return (
    <div className="h-max space-y-4 rounded-xl border border-gray-300 bg-white p-6">
      <h3 className="font-bold text-gray-900">Bill Summary</h3>

      <div className="space-y-4 text-sm">
        {[
          {
            label: "Subtotal",
            value: `₹${total_amount}`,
            bold: false,
          },
          {
            label: "Discount",
            value: `- ₹${total_discount}`,
            bold: true,
          },
          {
            label: "Shipping",
            value: charges ? `₹${charges}` : "FREE",
            bold: false,
          },
        ].map(({ label, value, bold }) => (
          <div className="flex items-center justify-between" key={label}>
            <span className="font-medium text-gray-600">{label}</span>
            <span
              className={clsx(
                "font-semibold text-gray-900",
                label === "Discount" && "text-orange-500",
              )}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* TOTAL SECTION */}
      <div className="border-t border-dotted border-gray-300 pt-6">
        <div className="flex items-end justify-between">
          {/* Left Side: Labels */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">
              Grand Total
            </span>
            <span className="inline-block w-fit rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200/50 ring-inset">
              Incl. all taxes
            </span>
          </div>

          {/* Right Side: Figure */}
          <div className="text-right">
            <span className="mr-1 text-sm font-semibold text-gray-600">₹</span>
            <span className="text-3xl font-bold tracking-tight text-gray-900">
              {(total_amount - total_discount + charges).toLocaleString(
                "en-IN",
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <button
        type="button"
        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-orange-500 py-2 font-semibold text-white shadow-sm"
        onClick={() => {}}
      >
        <FileText className="size-5 text-white" />
        <span className="relative z-10">Download Invoice</span>
      </button>
    </div>
  );
};
export default BillSummary;
