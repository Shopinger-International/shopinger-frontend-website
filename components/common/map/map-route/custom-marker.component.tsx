// types
import type { FC } from "react";

const CustomMarker: FC<{
  type: "start" | "end";
}> = ({ type }) => {
  const isStart = type === "start";

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse ring */}
      <span
        className={`absolute inline-flex h-10 w-10 animate-ping rounded-full opacity-75 ${
          isStart ? "bg-green-400" : "bg-red-400"
        }`}
      />

      {/* Inner circle */}
      <span
        className={`relative inline-flex h-6 w-6 rounded-full border-2 border-white shadow-lg ${
          isStart ? "bg-green-600" : "bg-red-600"
        }`}
      />

      {/* Optional label */}
      <span className="absolute top-8 text-xs font-medium">
        {isStart ? "Start" : "End"}
      </span>
    </div>
  );
};

export default CustomMarker;
