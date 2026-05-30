import type { FC } from "react";
import { Phone, MessageCircle } from "lucide-react";

type IDeliveryPartner = {
  name: string;
  phone: string;
};

type Props = {
  partner: IDeliveryPartner;
};

const DeliveryPartnerDetails: FC<Props> = ({ partner }) => {
  const handleCall = () => {
    window.location.href = `tel:${partner.phone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${partner.phone}`, "_blank");
  };

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-6">
      <h2 className="mb-4 font-semibold text-gray-900">Delivery Partner</h2>

      {/* Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-gray-900">
            {partner.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm leading-tight font-semibold text-gray-900">
              {partner.name}
            </p>

            <p className="mt-0.5 text-xs text-gray-600 font-medium">Delivery Partner</p>
          </div>
        </div>

        {/* Phone */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{partner.phone}</p>
          <p className="text-xs text-gray-600">Tap to contact</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex-col sm:flex-row flex gap-3">
        <button
          onClick={handleCall}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 w-full"
        >
          <Phone className="size-5" strokeWidth={2} />
          Call
        </button>

        <button
          onClick={handleWhatsApp}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 w-full"
        >
          <MessageCircle className="size-5" strokeWidth={2} />
          WhatsApp
        </button>
      </div>
    </div>
  );
};

export default DeliveryPartnerDetails;
