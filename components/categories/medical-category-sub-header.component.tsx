import { useState } from "react";
import type { FC } from "react";
import { LayoutDashboard, User, Pill, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export type MedicalHeaderTab = "all" | "doctor" | "medicine" | "lab_test";

interface IMedicalCategorySubHeaderProps {
  active_tab?: MedicalHeaderTab;
  onTabChange?: (tab: MedicalHeaderTab) => void;
}

const MedicalCategorySubHeader: FC<IMedicalCategorySubHeaderProps> = ({
  active_tab = "all",
  onTabChange,
}) => {
  const [selected_tab, setSelectedTab] = useState<MedicalHeaderTab>(active_tab);

  const handleTabClick = (tab_id: MedicalHeaderTab) => {
    setSelectedTab(tab_id);
    onTabChange?.(tab_id);

    const phone_number = process.env.NEXT_PUBLIC_ADMIN_PHONE || "";

    if (tab_id === "doctor") {
      const message = `*Doctor Appointment Request - Shopinger Medical*\n\nHello, I would like to book a doctor consultation. Please assist me with doctor availability and appointment slots.`;
      window.open(`https://wa.me/${phone_number}?text=${encodeURIComponent(message)}`, "_blank");
    } else if (tab_id === "medicine") {
      const message = `*Medicine Order Request - Shopinger Medical*\n\nHello, I would like to order medicines. Please assist me with placing my order.`;
      window.open(`https://wa.me/${phone_number}?text=${encodeURIComponent(message)}`, "_blank");
    } else if (tab_id === "lab_test") {
      const message = `*Lab Test Booking Request - Shopinger Medical*\n\nHello, I would like to book a lab test appointment. Please assist me with test packages and timing.`;
      window.open(`https://wa.me/${phone_number}?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  const tabs: { id: MedicalHeaderTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "all", label: "All", icon: LayoutDashboard },
    { id: "doctor", label: "Book Doctor", icon: User },
    { id: "medicine", label: "Medicine", icon: Pill },
    { id: "lab_test", label: "Lab Test", icon: FlaskConical },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-2xs py-2.5 px-4 mb-4">
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-2 sm:gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const is_active = selected_tab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl py-2 px-1 transition-all cursor-pointer",
                is_active
                  ? "bg-orange-50 text-orange-600 font-bold border border-orange-200 shadow-2xs"
                  : "bg-gray-50/70 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900 border border-transparent",
              )}
            >
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full transition-colors",
                  is_active
                    ? "bg-orange-100 text-orange-600"
                    : "bg-gray-200/60 text-gray-600 group-hover:bg-gray-200",
                )}
              >
                <Icon className="size-4 sm:size-5" />
              </div>

              <span className="text-xs sm:text-sm truncate text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MedicalCategorySubHeader;
