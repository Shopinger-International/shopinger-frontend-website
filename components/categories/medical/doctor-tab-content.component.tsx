import type { FC } from "react";
import Image from "next/image";
import { Video, Search, Calendar } from "lucide-react";

const DoctorTabContent: FC = () => {
  const handleBookConsultation = () => {
    const message = `*Online Doctor Consultation Request - Shopinger Medical*

Hello, I would like to book an online doctor consultation. Please assist me with doctor availability and appointment slots.`;

    const phone_number = process.env.NEXT_PUBLIC_ADMIN_PHONE || "";
    const whatsapp_url = `https://wa.me/${phone_number}?text=${encodeURIComponent(message)}`;
    window.open(whatsapp_url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h3 className="text-lg font-bold text-gray-900">Book your doctor online</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Consult a doctor from the comfort of home.
        </p>
      </div>

      {/* Doctor Consultation Card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="flex items-center gap-4">
          {/* Doctor Portrait */}
          <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
            <Image
              src="/images/medical/doctor-portrait.png"
              alt="Online Doctor Consultation"
              fill
              className="object-cover"
            />
          </div>

          {/* Consultation Details */}
          <div className="flex flex-col min-w-0 flex-1">
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
              Online doctor consultation
            </h4>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-grey-300">
              <Video className="size-4 text-orange-500 fill-orange-500/20 shrink-0" />
              <span>Consult over video</span>
            </div>
            <button
              type="button"
              onClick={handleBookConsultation}
              className="mt-3 w-full rounded-xl bg-orange-500 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#E04900] active:scale-[0.99] transition-all cursor-pointer"
            >
              Book a consultation
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 ">
        <h4 className="text-sm font-bold text-gray-900 mb-3">How it works</h4>

        <div className="divide-y divide-gray-100">
          <div className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <Search className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-800">
              Choose a doctor
            </span>
          </div>
          <div className="flex items-center gap-3 py-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <Calendar className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-800">
              Select a convenient slot
            </span>
          </div>
          <div className="flex items-center gap-3 py-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <Video className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-800">
              Join your online consultation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorTabContent;
