import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

type IProps = {
  end_at: Date;
};

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

const CountDownTimer = ({ end_at }: IProps) => {
  const [time_left, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(end_at),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getTimeLeft(end_at);

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

    return () => clearInterval(interval);
  }, [end_at]);

  const items = [
    {
      label: "Days",
      value: time_left.days,
      hidden: time_left.days === 0,
    },
    {
      label: "Hours",
      value: time_left.hours,
    },
    {
      label: "Min",
      value: time_left.minutes,
    },
    {
      label: "Sec",
      value: time_left.seconds,
      highlight: true,
    },
  ].filter((item) => !item.hidden);

  return (
    <div className="flex items-center gap-1">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex h-10 min-w-10 items-center justify-center rounded border border-gray-300 bg-white font-mono font-bold text-gray-900"
        >
          {String(item.value).padStart(2, "0")}
        </div>
      ))}
    </div>
  );
};

export default CountDownTimer;
