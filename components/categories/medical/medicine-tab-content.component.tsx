import type { FC } from "react";
import { Upload, PhoneCall, FileText, UserCheck, Truck } from "lucide-react";

const MedicineTabContent: FC = () => {
  const handleUploadPrescription = () => {
    const message = `*Prescription Medicine Order Request - Shopinger Medical*

Hello, I would like to order medicines by sharing my prescription. Please assist me with verifying my prescription and placing the order.`;

    const phone_number = process.env.NEXT_PUBLIC_ADMIN_PHONE || "";
    const whatsapp_url = `https://wa.me/${phone_number}?text=${encodeURIComponent(message)}`;
    window.open(whatsapp_url, "_blank");
  };

  const handleCallOrder = () => {
    window.location.href = "tel:+919415761434";
  };

  return (
    <div className="space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h3 className="text-lg font-bold text-gray-900">Order medicines in minutes</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Upload your prescription or call to order.
        </p>
      </div>

      {/* Upload Prescription Card */}
      <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-orange-100/80 text-orange-600 mb-2">
          <Upload className="size-6" />
        </div>

        <h4 className="text-sm sm:text-base font-semibold text-gray-900">
          Upload your prescription
        </h4>

        <p className="text-xs text-gray-500 mt-0.5 mb-4">
          Take a photo or upload a clear copy
        </p>

        <button
          type="button"
          onClick={handleUploadPrescription}
          className="w-full rounded-xl bg-orange-500 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#E04900] active:scale-[0.99] transition-all cursor-pointer"
        >
          Upload prescription
        </button>

        <span className="mt-2 text-[10px] font-medium text-gray-400">
          JPG, PNG or PDF • Up to 10 MB
        </span>
      </div>

      {/* Call to Order Card */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-100/80 text-orange-600">
            <PhoneCall className="size-5" />
          </div>

          <div className="flex flex-col min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
              Call to order
            </h4>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">
              Our team will help you place your order.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCallOrder}
          className="shrink-0 rounded-xl border border-orange-500 px-4 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
        >
          Call now
        </button>
      </div>

      {/* Prescription Requirements Card */}
      <div className="rounded-2xl p-4 space-y-3">
        <h4 className="text-sm font-bold text-gray-900">Prescription requirements</h4>

        <p className="text-xs text-gray-500 leading-relaxed">
          Only valid prescriptions with the doctor&apos;s name, stamp and signature are accepted. Verified by a pharmacist before order confirmation.
        </p>

        {/* 3 Step Process Icons */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
          <div className="flex flex-col items-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-100/80 text-orange-600 mb-1.5">
              <FileText className="size-5" />
            </div>
            <span className="text-[11px] font-medium text-gray-700">Upload</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-100/80 text-orange-600 mb-1.5">
              <UserCheck className="size-5" />
            </div>
            <span className="text-[11px] font-medium text-gray-700">Pharmacist review</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-100/80 text-orange-600 mb-1.5">
              <Truck className="size-5" />
            </div>
            <span className="text-[11px] font-medium text-gray-700">Delivery</span>
          </div>
        </div>

        <p className="text-[10px] font-medium text-gray-400 text-center pt-1">
          Delivery time is confirmed after verification.
        </p>
      </div>
    </div>
  );
};

export default MedicineTabContent;
