import React from "react";
import { Check } from "lucide-react";

// helpers
import clsx from "clsx";

type Step = {
  id: number;
  title: string;
  description: string;
};

type Props = {
  steps: Step[];
  selected_step: number; // 1-based index
  updateStep: (step: number) => void;
};

const Stepper: React.FC<Props> = ({ steps, selected_step, updateStep }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-300 bg-white">
      <div className="flex w-full">
        {steps.map((step) => {
          const is_completed = step.id < selected_step;
          const is_active = step.id === selected_step;

          return (
            <div
              key={step.id}
              className="relative flex-1 cursor-pointer"
              onClick={() => updateStep(step.id)}
            >
              {/* STEP CONTENT */}
              <div
                className={clsx(
                  "flex items-center gap-4 px-6 py-6 transition-all",
                  is_active ? "bg-orange-50" : "bg-white",
                  step.id < steps.length && "border-r border-gray-300",
                )}
              >
                {/* ICON */}
                <div
                  className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                    is_completed
                      ? "border-orange-500 bg-orange-500 text-white"
                      : is_active
                        ? "border-orange-500 text-orange-500"
                        : "border-gray-300 text-gray-600",
                  )}
                >
                  {is_completed ? (
                    <Check size={18} />
                  ) : (
                    step.id.toString().padStart(2, "0")
                  )}
                </div>

                {/* TEXT */}
                <div className="space-y-0.5">
                  <p
                    className={clsx(
                      "text-sm font-semibold",
                      is_active ? "text-orange-500" : "text-gray-900",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* ACTIVE UNDERLINE */}
              {is_active && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-orange-500"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
