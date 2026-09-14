import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Check, Search, Send, X } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { MdSearchOff } from "react-icons/md";

export default function ProductNotFound({ query }: { query: string }) {
  const [is_open, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [min_price, setMinPrice] = useState("");
  const [max_price, setMaxPrice] = useState("");
  const [sent_request, setSentRequest] = useState(false);
  const [notify_call, setNotifyCall] = useState(true);
  const [notify_sms, setNotifySms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `
   Hi Shopinger,I'd like to request a product:
     Product: ${query}
     Quantity: ${quantity}
     Expected Price: ${
       min_price || max_price
         ? `₹${min_price || "—"} - ₹${max_price || "—"}`
         : "Not specified"
     }
     Notify me by: ${
       notify_call && notify_sms
         ? "Call & SMS"
         : notify_call
           ? "Call"
           : notify_sms
             ? "SMS"
             : "None"
     }

  Please let me know if you can arrange this product.
  `.trim();

    const whatsapp_number = "+919415761434"; // your WhatsApp number

    const whatsapp_url = `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(
      message,
    )}`;

    window.location.href = whatsapp_url;
    setIsOpen(false);
    setSentRequest(true);
  };

  return (
    <div className="col-span-full flex min-h-[300px] items-center justify-center px-4">
      {!sent_request ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-50">
            <MdSearchOff className="size-28 text-orange-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
            No Products Found
          </h2>

          <p className="mt-1 text-lg font-semibold text-orange-500">
            "{query}"
          </p>

          <p className="mt-2 max-w-lg text-sm text-gray-500 md:text-base">
            Can’t find what you need? Request it and we’ll try to make it
            available for you
          </p>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-5 flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Send className="size-4" />
            Request this Product
          </button>

          <Dialog
            open={is_open}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <DialogPanel className="w-full max-w-xl rounded-xl bg-white p-5 shadow-2xl">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-lg font-bold text-slate-900">
                      Request <span className="text-orange-500">Product</span>
                    </DialogTitle>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Fields */}
                  <div className="flex flex-col gap-3 md:flex-row">
                    {/* Product */}
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Product
                      </label>

                      <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm">
                        {query}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="w-full md:w-24">
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Quantity
                      </label>

                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-500"
                      />
                    </div>

                    {/* Price */}
                    <div className="w-full md:w-44">
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Price Range
                      </label>

                      <div className="flex items-center gap-1">
                        <div className="flex h-10 flex-1 items-center rounded-lg border border-slate-200 px-2">
                          <span className="text-xs text-slate-400">₹</span>
                          <input
                            type="number"
                            value={min_price}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min"
                            className="w-full bg-transparent px-1 text-xs outline-none"
                          />
                        </div>

                        <span className="text-slate-400">–</span>

                        <div className="flex h-10 flex-1 items-center rounded-lg border border-slate-200 px-2">
                          <span className="text-xs text-slate-400">₹</span>
                          <input
                            type="number"
                            value={max_price}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max"
                            className="w-full bg-transparent px-1 text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification + Submit */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-medium text-slate-600">
                        Notify me by:
                      </span>

                      <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={notify_call}
                          onChange={(e) => setNotifyCall(e.target.checked)}
                          className="accent-orange-500"
                        />
                        Call
                      </label>

                      <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={notify_sms}
                          onChange={(e) => setNotifySms(e.target.checked)}
                          className="accent-orange-500"
                        />
                        SMS
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      <FaWhatsapp className="size-4" />
                      Send
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </div>
          </Dialog>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-50">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-500">
              <Check className="size-7 text-white" strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Request Sent</h2>

          <p className="mt-1 text-sm text-slate-500">
            We've received your request for
          </p>

          <p className="mt-1 max-w-md truncate text-base font-semibold text-orange-500">
            "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
