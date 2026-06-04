// types
import type { FC } from "react";

// icons
import { Package, RotateCw, ShieldCheck, Banknote } from "lucide-react";

const polices = [
  {
    icon: RotateCw,
    label: "7 Days Return",
    para: "Easy replacement & pickup",
  },
  {
    icon: ShieldCheck,
    label: "Secure Delivery",
    para: "Verified delivery partners",
  },
  {
    icon: Banknote,
    label: "Cash on Delivery",
    para: "Pay at doorstep safely",
  },
];

const DeliveryDetails: FC = () => {
  return (
    <section
      aria-labelledby="delivery-details-heading"
      className="order-8 mb-4 space-y-2 lg:space-y-3"
    >
      <h2
        id="delivery-details-heading"
        className="text-sm font-medium lg:text-base"
      >
        Delivery Details
      </h2>

      {/* Highlight Banner */}
      <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
        {/* HERO */}
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-orange-50 p-2">
            <Package aria-hidden={true} className="size-4 text-orange-600" />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-gray-900">
              Same day Delivery
            </p>
            <p className="text-xs text-gray-600">
              Fast & reliable doorstep delivery
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-gray-300 pt-3">
          {polices.map(({ icon: Icon, label, para }, index) => (
            <div className="space-y-1" key={`policy-${index}`}>
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-900">{label}</p>
              </div>
              <p className="ml-6 text-xs text-gray-600">{para}</p>
            </div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div className="border-t border-gray-300 pt-3">
          <p className="text-xs leading-relaxed text-gray-500">
            Orders placed after{" "}
            <span className="font-medium text-gray-700">10 PM</span> will be
            delivered next day.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DeliveryDetails;
