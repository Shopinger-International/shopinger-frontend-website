import type { FC } from "react";
import { User, Pill, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export type MedicalTab = "doctor" | "medicine" | "lab_tests";

interface IMedicalTabNavigationProps {
  active_tab: MedicalTab;
  on_tab_change: (tab: MedicalTab) => void;
}

const tabs: { id: MedicalTab; label: string; icon: typeof User }[] = [
  { id: "doctor", label: "Doctor", icon: User },
  { id: "medicine", label: "Medicine", icon: Pill },
  { id: "lab_tests", label: "Lab Tests", icon: FlaskConical },
];

const MedicalTabNavigation: FC<IMedicalTabNavigationProps> = ({
  active_tab,
  on_tab_change,
}) => {
  return (
    <div className="border-b border-gray-200 bg-white pt-2">
      <div className="grid grid-cols-3 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const is_active = active_tab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => on_tab_change(tab.id)}
              className={cn(
                "group relative flex flex-col items-center gap-1.5 pb-3 transition-colors cursor-pointer",
                is_active ? "text-orange-600 font-bold" : "text-gray-500 font-medium hover:text-gray-800",
              )}
            >
              {/* Icon Circle */}
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-full transition-colors",
                  is_active
                    ? "bg-orange-100 text-orange-600"
                    : "bg-orange-50/70 text-orange-500 group-hover:bg-orange-100/60",
                )}
              >
                <Icon className="size-5" />
              </div>

              {/* Label */}
              <span className="text-xs sm:text-sm">{tab.label}</span>

              {/* Bottom Active Line */}
              {is_active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-md" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MedicalTabNavigation;
