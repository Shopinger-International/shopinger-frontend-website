import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Check, Plus, Send, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { MdSearchOff } from "react-icons/md";

type ProductRequest = {
  id: number;
  name: string;
  quantity: number;
  min_price: string;
  max_price: string;
};

export default function ProductNotFound({ query }: { query: string }) {
  const [is_open, setIsOpen] = useState(false);

  const [products, setProducts] = useState<ProductRequest[]>([
    {
      id: Date.now(),
      name: query,
      quantity: 1,
      min_price: "",
      max_price: "",
    },
  ]);

  const [sent_request, setSentRequest] = useState(false);
  const [notify_call, setNotifyCall] = useState(true);
  const [notify_sms, setNotifySms] = useState(true);

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        quantity: 1,
        min_price: "",
        max_price: "",
      },
    ]);
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => {
      // Don't allow removing the last row
      if (prev.length === 1) {
        return prev;
      }

      return prev.filter((product) => product.id !== id);
    });
  };

  const updateProduct = (
    id: number,
    field: keyof Omit<ProductRequest, "id">,
    value: string | number,
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              [field]: value,
            }
          : product,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const product_message = products
      .map((product, index) => {
        const price =
          product.min_price || product.max_price
            ? `₹${product.min_price || "—"} - ₹${product.max_price || "—"}`
            : "Not specified";

        return `
${index + 1}. Product: ${product.name}
   Quantity: ${product.quantity}
   Expected Price: ${price}
`;
      })
      .join("\n");

    const notify_method =
      notify_call && notify_sms
        ? "Call & SMS"
        : notify_call
          ? "Call"
          : notify_sms
            ? "SMS"
            : "None";

    const message = `
Hi Shopinger,

I'd like to request the following products:

${product_message}

Notify me by: ${notify_method}

Please let me know if you can arrange these products.
`.trim();

    const whatsapp_number = "+919415761434";

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

            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
              <DialogPanel className="my-8 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* Header - stays fixed */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <DialogTitle className="text-lg font-bold text-slate-900">
                      Request <span className="text-orange-500">Products</span>
                    </DialogTitle>

                    <p className="mt-1 text-xs text-slate-500">
                      Add one or more products you are looking for.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  {/* ONLY THIS AREA SCROLLS */}
                  <div className="min-h-0 flex-1 overflow-y-auto p-5">
                    <div className="space-y-3">
                      {products.map((product, index) => (
                        <div
                          key={product.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                        >
                          {/* Row Header */}
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">
                              Product {index + 1}
                            </span>

                            {products.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProduct(product.id)}
                                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="size-3.5" />
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_90px_180px]">
                            {/* Product Name */}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                Product Name
                              </label>

                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) =>
                                  updateProduct(
                                    product.id,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter product name"
                                required
                                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                              />
                            </div>

                            {/* Quantity */}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                Quantity
                              </label>

                              <input
                                type="number"
                                min={1}
                                max={100}
                                value={product.quantity}
                                onChange={(e) =>
                                  updateProduct(
                                    product.id,
                                    "quantity",
                                    Number(e.target.value),
                                  )
                                }
                                required
                                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                              />
                            </div>

                            {/* Price */}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                Price Range
                              </label>

                              <div className="flex items-center gap-1">
                                <div className="flex h-10 flex-1 items-center rounded-lg border border-slate-200 bg-white px-2">
                                  <span className="text-xs text-slate-400">
                                    ₹
                                  </span>

                                  <input
                                    type="number"
                                    min={0}
                                    value={product.min_price}
                                    onChange={(e) =>
                                      updateProduct(
                                        product.id,
                                        "min_price",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Min"
                                    className="w-full bg-transparent px-1 text-xs outline-none"
                                  />
                                </div>

                                <span className="text-slate-400">–</span>

                                <div className="flex h-10 flex-1 items-center rounded-lg border border-slate-200 bg-white px-2">
                                  <span className="text-xs text-slate-400">
                                    ₹
                                  </span>

                                  <input
                                    type="number"
                                    min={0}
                                    value={product.max_price}
                                    onChange={(e) =>
                                      updateProduct(
                                        product.id,
                                        "max_price",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Max"
                                    className="w-full bg-transparent px-1 text-xs outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Product */}
                    <button
                      type="button"
                      onClick={addProduct}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-orange-300 py-2.5 text-sm font-semibold text-orange-500 transition hover:border-orange-500 hover:bg-orange-50"
                    >
                      <Plus className="size-4" />
                      Add Another Product
                    </button>
                  </div>

                  {/* Footer - stays fixed */}
                  <div className="shrink-0 border-t border-slate-100 bg-white p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-4">
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
                        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        <FaWhatsapp className="size-4" />
                        Send Request
                      </button>
                    </div>
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
            We've received your product request.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            We'll get back to you as soon as possible.
          </p>
        </div>
      )}
    </div>
  );
}
