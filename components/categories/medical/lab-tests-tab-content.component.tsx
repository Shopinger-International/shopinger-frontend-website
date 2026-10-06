import { useState } from "react";
import type { FC } from "react";
import {
  Droplet,
  Activity,
  ShieldCheck,
  PackagePlus,
  FlaskConical,
  FileText,
  Calendar,
  ChevronRight,
  ChevronDown,
  Info,
  Check,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const test_options = [
  { id: "Blood Tests", label: "Blood Tests", icon: Droplet },
  { id: "Diabetes Tests", label: "Diabetes Tests", icon: Activity },
  { id: "Thyroid Tests", label: "Thyroid Tests", icon: ShieldCheck },
  { id: "Health Packages", label: "Health Packages", icon: PackagePlus },
];

const date_options = ["Today", "Tomorrow", "Day after tomorrow"];

const time_slot_options = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

const LabTestsTabContent: FC = () => {
  const [selected_tests, setSelectedTests] = useState<string[]>([]);
  const [selected_date, setSelectedDate] = useState<string | null>(null);
  const [selected_time, setSelectedTime] = useState<string | null>(null);
  const [show_date_picker, setShowDatePicker] = useState<boolean>(false);

  const is_book_enabled = Boolean(
    selected_date && selected_time && selected_tests.length > 0,
  );

  const toggleTest = (test_name: string) => {
    setSelectedTests((prev) =>
      prev.includes(test_name)
        ? prev.length > 1
          ? prev.filter((t) => t !== test_name)
          : prev
        : [...prev, test_name],
    );
  };

  const handleBookLabTest = () => {
    if (!is_book_enabled || !selected_date || !selected_time) return;

    const tests_formatted =
      selected_tests.length > 0
        ? selected_tests.map((t) => `• ${t}`).join("\n")
        : "• Lab Test";

    const message = `*Lab Test Booking Request - Shopinger Medical*

🧪 *Selected Tests:*
${tests_formatted}

📅 *Preferred Date:* ${selected_date}
⏰ *Preferred Time Slot:* ${selected_time}

Please confirm my lab test appointment booking.`;

    const phone_number = process.env.NEXT_PUBLIC_ADMIN_PHONE || "";
    const whatsapp_url = `https://wa.me/${phone_number}?text=${encodeURIComponent(message)}`;
    window.open(whatsapp_url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h3 className="text-lg font-bold text-gray-900">Book your lab test</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Choose a test and schedule an appointment.
        </p>
      </div>

      {/* Explore Tests Section (Clickable Buttons) */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
          Explore tests
        </h4>

        <div className="grid grid-cols-2 gap-2.5">
          {test_options.map((item) => {
            const Icon = item.icon;
            const is_selected = selected_tests.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleTest(item.id)}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer",
                  is_selected
                    ? "border-orange-500 bg-orange-50/70 text-orange-900 ring-1 ring-orange-500"
                    : "border-gray-100 bg-white text-gray-800 hover:border-orange-200",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={cn(
                      "size-5 shrink-0",
                      is_selected ? "text-orange-600" : "text-orange-500",
                    )}
                  />
                  <span className="text-xs font-medium truncate">
                    {item.label}
                  </span>
                </div>

                {is_selected && (
                  <Check className="size-4 text-orange-600 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Your Test Card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100/80 text-orange-600">
            <FlaskConical className="size-4" />
          </div>
          <h4 className="text-sm font-bold text-gray-900">Schedule your test</h4>
        </div>

        {/* Date & Time Selector Trigger */}
        <div className="border-t border-b border-gray-100 py-1">
          <button
            type="button"
            onClick={() => setShowDatePicker((prev) => !prev)}
            className="flex w-full items-center justify-between py-2 cursor-pointer hover:bg-gray-50/50 rounded-lg px-1 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Calendar className="size-4 text-orange-500 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-gray-700">
                  Select date & time
                </span>
                {selected_date && selected_time ? (
                  <span className="text-[11px] font-bold text-orange-600 truncate mt-0.5">
                    {selected_date} • {selected_time}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-gray-400 truncate mt-0.5">
                    Tap to choose date & time slot
                  </span>
                )}
              </div>
            </div>

            {show_date_picker ? (
              <ChevronDown className="size-4 text-orange-500 shrink-0" />
            ) : (
              <ChevronRight className="size-4 text-orange-500 shrink-0" />
            )}
          </button>

          {/* Date & Time Picker */}
          {show_date_picker && (
            <div className="mt-2 space-y-3 rounded-xl bg-orange-50/40 p-3 border border-orange-100">
              {/* Date Selection */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1.5">
                  Select Preferred Date:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {date_options.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer",
                        selected_date === d
                          ? "bg-orange-500 text-white shadow-2xs"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1.5 flex items-center gap-1">
                  <Clock className="size-3 text-orange-500" />
                  Select Time Slot:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {time_slot_options.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        "rounded-lg px-2 py-1.5 text-[11px] font-semibold text-center transition-colors cursor-pointer truncate",
                        selected_time === slot
                          ? "bg-orange-500 text-white shadow-2xs"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!is_book_enabled}
          onClick={handleBookLabTest}
          className={cn(
            "w-full rounded-xl py-2.5 px-4 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2",
            is_book_enabled
              ? "bg-orange-500 hover:bg-[#E04900] text-white active:scale-[0.99] cursor-pointer"
              : "bg-gray-200 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none",
          )}
        >
          <span>Book a lab test</span>
        </button>
      </div>

      {/* Info Card: Before your test */}
      <div className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50/50 p-3.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 mt-0.5">
          <Info className="size-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-xs font-bold text-gray-900">Before your test</h4>
          <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
            Test preparation and appointment details will be shared after confirmation.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">How it works</h4>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-orange-600 mb-1.5">
              <FileText className="size-4" />
            </div>
            <span className="text-[11px] font-medium text-gray-700">Choose a test</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-orange-600 mb-1.5">
              <Calendar className="size-4" />
            </div>
            <span className="text-[11px] font-medium text-gray-700">Book a slot</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-orange-600 mb-1.5">
              <FileText className="size-4" />
            </div>
            <span className="text-[11px] font-medium text-gray-700">Receive your report</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestsTabContent;
