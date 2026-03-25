import React from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

type StepStatus = "completed" | "current" | "upcoming";

type Step = {
  id: number;
  title: string;
  description?: string;
  date?: string;
  status: StepStatus;
};

type Props = {
  steps: Step[];
};

const OrderTimeline: React.FC<Props> = ({ steps }) => {
  return (
    <div className="mx-auto w-full max-w-2xl">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          {/* LEFT ICON + LINE */}
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                {
                  "border-green-500 bg-green-500 text-white":
                    step.status === "completed",
                  "border-blue-500 text-blue-500": step.status === "current",
                  "border-gray-300 text-gray-400": step.status === "upcoming",
                },
              )}
            >
              {step.status === "completed" ? <Check size={16} /> : index + 1}
            </div>

            {/* LINE */}
            {index !== steps.length - 1 && (
              <div
                className={clsx("w-px flex-1", {
                  "bg-green-500": step.status === "completed",
                  "bg-gray-300": step.status !== "completed",
                })}
              />
            )}
          </div>

          {/* RIGHT CONTENT */}
          <div className="pb-8">
            <h3
              className={clsx("text-sm font-semibold", {
                "text-gray-900": step.status !== "upcoming",
                "text-gray-400": step.status === "upcoming",
              })}
            >
              {step.title}
            </h3>

            {step.description && (
              <p className="text-sm text-gray-500">{step.description}</p>
            )}

            {step.date && (
              <p className="mt-1 text-xs text-gray-400">{step.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;
