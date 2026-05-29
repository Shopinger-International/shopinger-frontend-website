// types
import type { FC } from "react";

// icons
import { Bike, Home } from "lucide-react";

type MarkerType = "start" | "end";

interface CustomMarkerProps {
  type: MarkerType;
}

const CustomMarker: FC<CustomMarkerProps> = ({ type }) => {
  const is_delivery = type === "start";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-xl transition-all duration-300 hover:scale-110 ${
          is_delivery ? "bg-amber-500 text-white" : "bg-orange-500 text-white"
        }`}
      >
        {is_delivery ? (
          <Bike size={20} strokeWidth={2.5} className="animate-pulse" />
        ) : (
          <Home size={18} strokeWidth={2.5} />
        )}
      </div>

      {/* 3. Drop-Pin Pointer Triangle */}
      <div
        className={`-mt-1 h-2 w-2 rotate-45 border-r border-b border-white shadow-md ${
          is_delivery ? "bg-amber-500" : "bg-orange-500"
        }`}
      />

      {/* 4. Floating Text Badge Label */}
      <span className="mt-1 rounded-full bg-slate-900/90 px-2 py-0.5 text-[9px] font-bold tracking-wider whitespace-nowrap text-white uppercase shadow-md backdrop-blur-sm">
        {is_delivery ? "Rider" : "Home"}
      </span>
    </div>
  );
};

export default CustomMarker;
