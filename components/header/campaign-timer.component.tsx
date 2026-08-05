import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// types
import type { FC } from "react";

// helpers
import { differenceInSeconds, format } from "date-fns";

// hooks
import useGetTimeWindowCampaign from "@/hooks/axios/campaign/use-get-time-window-campaign.hook";

// icons
import { FaArrowRightLong } from "react-icons/fa6";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total_seconds: number;
};

function getTimeLeft(target_date: Date): TimeLeft {
  const diff_in_sec = Math.max(0, differenceInSeconds(target_date, new Date()));

  return {
    days: Math.floor(diff_in_sec / 86400),
    hours: Math.floor((diff_in_sec / 3600) % 24),
    minutes: Math.floor((diff_in_sec / 60) % 60),
    seconds: diff_in_sec % 60,
    total_seconds: diff_in_sec,
  };
}

const CampaignTimer: FC = () => {
  const { data: campaign } = useGetTimeWindowCampaign();

  const [time_left, setTimeLeft] = useState<TimeLeft | null>(null);

  const campaign_state = useMemo(() => {
    if (!campaign) return null;

    const now = new Date();

    const start_at = new Date(campaign.start_at);
    const end_at = new Date(campaign.end_at);

    if (now < start_at) {
      return {
        status: "UPCOMING" as const,
        target_date: start_at,
      };
    }

    if (now < end_at) {
      return {
        status: "ACTIVE" as const,
        target_date: end_at,
      };
    }

    return {
      status: "ENDED" as const,
      target_date: null,
    };
  }, [campaign]);

  useEffect(() => {
    if (!campaign_state?.target_date) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      setTimeLeft(getTimeLeft(campaign_state.target_date!));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [campaign_state]);

  if (!campaign || !campaign_state || campaign_state.status === "ENDED") {
    return null;
  }

  // Check if less than 24 (86400 sec) hours remain
  const is_within_24hours = time_left ? time_left.total_seconds < 86400 : false;

  const timer_content =
    time_left && is_within_24hours ? (
      <span className="font-semibold tracking-wider text-orange-500">
        {String(time_left.hours).padStart(2, "0")}:
        {String(time_left.minutes).padStart(2, "0")}:
        {String(time_left.seconds).padStart(2, "0")}
      </span>
    ) : (
      <span className="font-semibold tracking-tight text-orange-500">
        {campaign_state.target_date
          ? format(campaign_state.target_date, "MMM d, yyyy h:mm a")
          : ""}
      </span>
    );

  if (campaign_state.status === "UPCOMING") {
    return (
      <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-orange-500 bg-orange-50 px-2.5 py-1 text-xs sm:text-sm md:px-3">
        <span className="text-[10px] font-medium tracking-wider text-black uppercase md:text-xs">
          {is_within_24hours ? "Sale starts In" : "Sale starts On"}
        </span>
        <span>{timer_content}</span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-fit items-center gap-3 text-xs sm:text-sm">
      <div className="flex items-center gap-1.5 rounded-full border border-orange-500 bg-orange-50 px-2.5 py-1 md:px-3">
        <span className="text-[10px] font-medium tracking-wider text-black uppercase md:text-xs">
          {is_within_24hours ? "Sale ends In" : "Sale ends On"}
        </span>
        <span className="font-bold text-black">{timer_content}</span>
      </div>

      <Link
        href={`campaign/${campaign.id}/${campaign.slug}`}
        className="flex items-center rounded-full border border-orange-500 bg-orange-500 px-2.5 py-1 text-white md:px-3"
      >
        <FaArrowRightLong className="size-4 sm:size-5" />
      </Link>
    </div>
  );
};

export default CampaignTimer;
