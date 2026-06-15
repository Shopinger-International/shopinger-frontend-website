// types
import type { FC } from "react";

const CampaignTimer: FC = () => {
  return (
    <div className="relative border-b border-red-500/20 bg-black px-4 py-2.5 text-white">
      <div className="flex items-center justify-center gap-3 text-sm">
        {/* Urgency Badge */}
        <span className="flex animate-pulse items-center gap-1 font-semibold text-red-400">
          🚨 Last Chance
        </span>

        <span className="text-neutral-300">
          Flash Sale is ending encoding! Up to 50% off
        </span>

        {/* High-Urgency Countdown */}
        <div className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1">
          <span className="mr-1 text-xs font-medium tracking-wider text-red-400 uppercase">
            Ends In:
          </span>
          <span className="font-mono font-bold text-red-200">00:45:12</span>
        </div>

        {/* Aggressive CTA */}
        <button className="font-medium text-orange-400 underline underline-offset-4 transition-colors hover:text-orange-300">
          Shop Deals Before They're Gone →
        </button>
      </div>
    </div>
  );
};

export default CampaignTimer;
