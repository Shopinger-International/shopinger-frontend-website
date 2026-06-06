import Link from "next/link";
// types
import type { FC } from "react";

// icons
import { Phone, MessageCircle } from "lucide-react";

type IDeliveryPartner = {
  name: string;
  phone: string;
};

type Props = {
  partner: IDeliveryPartner;
};

const DeliveryPartnerDetails: FC<Props> = ({ partner }) => {
  return (
    <div className="rounded-xl border border-orange-200 bg-linear-to-r from-orange-50 to-white px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500 font-semibold text-white sm:size-11">
            {partner.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-xs font-medium tracking-wide text-orange-600 uppercase">
              Assigned Delivery Partner
            </p>

            <p className="text-sm font-semibold text-gray-900 sm:text-base">
              {partner.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Link
            href={`tel:${partner.phone}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            <Phone className="size-4" />
            Call
          </Link>

          <Link
            href={`https://wa.me/${partner.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartnerDetails;
