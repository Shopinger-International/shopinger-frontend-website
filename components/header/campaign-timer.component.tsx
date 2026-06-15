import { useEffect, useState } from "react";
// types
import type { FC } from "react";

// hooks
import useAllCamapigns from "@/hooks/axios/campaign/use-campaigns.hook";

// helpers
import { differenceInSeconds } from "date-fns";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(end_at: Date): TimeLeft {
  const diff_in_sec = Math.max(0, differenceInSeconds(end_at, new Date()));

  return {
    days: Math.floor(diff_in_sec / 86400),
    hours: Math.floor((diff_in_sec / 3600) % 24),
    minutes: Math.floor((diff_in_sec / 60) % 60),
    seconds: diff_in_sec % 60,
  };
}

const CampaignTimer: FC = () => {
  const { data: campaigns = [] } = useAllCamapigns();
  const [time_left, setTimeLeft] = useState<TimeLeft | null>();
  const time_window_campaigns = campaigns.find(
    (campaign) => campaign.type == "TIME_WINDOW_SALE",
  );
  const end_at = time_window_campaigns?.end_at;
  const end_at_date = end_at ? new Date(end_at) : null;
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (end_at_date) {
      interval = setInterval(() => {
        const next = getTimeLeft(end_at_date);

        setTimeLeft(next);

        const is_expired =
          next.days === 0 &&
          next.hours === 0 &&
          next.minutes === 0 &&
          next.seconds === 0;

        if (is_expired) {
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [end_at_date]);
  if (!time_window_campaigns) return null;
  return (
    <div className="relative border-b border-gray-300 bg-black px-4 py-2.5 text-white">
      <div className="flex items-center justify-center gap-3 text-sm">
        {/* Hype Badge */}
        <span className="flex items-center gap-1 font-semibold">
          👀 Dropping Soon: {time_window_campaigns.title}
        </span>
        <span className="text-neutral-300">
          {time_window_campaigns.description}
        </span>

        {/* "Starts In" Countdown */}
        {time_left && (
          <div className="flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1">
            <span className="mr-1 text-xs font-medium tracking-wider text-orange-400 uppercase">
              Starts In:
            </span>
            <span className="font-mono font-semibold text-orange-200">
              {!!time_left?.days && time_left.days + ":"}
              {time_left?.hours}:{time_left?.minutes}:{time_left?.seconds}
            </span>
          </div>
        )}

        {/* Actionable CTA for previewing */}
        <button className="font-medium text-orange-400 transition-colors hover:text-orange-300">
          Preview Deals →
        </button>
      </div>
    </div>
    // <div className="relative border-b border-red-500/20 bg-black px-4 py-2.5 text-white">
    //   <div className="flex items-center justify-center gap-3 text-sm">
    //     {/* Urgency Badge */}
    //     <span className="flex animate-pulse items-center gap-1 font-semibold text-red-400">
    //       🚨 Last Chance
    //     </span>

    //     <span className="text-neutral-300">
    //       Flash Sale is ending encoding! Up to 50% off
    //     </span>

    //     {/* High-Urgency Countdown */}
    //     <div className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1">
    //       <span className="mr-1 text-xs font-medium tracking-wider text-red-400 uppercase">
    //         Ends In:
    //       </span>
    //       <span className="font-mono font-bold text-red-200">00:45:12</span>
    //     </div>

    //     {/* Aggressive CTA */}
    //     <button className="font-medium text-orange-400 underline underline-offset-4 transition-colors hover:text-orange-300">
    //       Shop Deals Before They're Gone →
    //     </button>
    //   </div>
    // </div>
  );
};

export default CampaignTimer;
