import { useEffect, useState } from "react";

// helpers
import { differenceInSeconds } from "date-fns";

type IProps = {
  end_at: Date;
};

const CountDownTimer = ({ end_at }: IProps) => {
  const [time, setTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const update = () => {
      const diff_in_sec = differenceInSeconds(end_at, Date.now());
      if (diff_in_sec <= 0) {
        setTime({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(diff_in_sec / 86400);
      const hours = Math.floor((diff_in_sec / 3600) % 24);
      const minutes = Math.floor((diff_in_sec / 60) % 60);
      const seconds = diff_in_sec % 60;
      setTime({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
      console.log("value of days", days, hours, minutes);
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [end_at]);

  return (
    <div className="flex items-center gap-1 rounded-lg bg-black/50 p-2 backdrop-blur-md">
      {time.days !== "00" && (
        <>
          <TimeBox value={time.days} />
          <span className="text-white">:</span>
        </>
      )}
      <TimeBox value={time.hours} />
      <span className="text-white">:</span>
      <TimeBox value={time.minutes} />
      <span className="text-white">:</span>
      <TimeBox value={time.seconds} />
    </div>
  );
};

function TimeBox({ value }: { value: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded bg-red-500 font-bold text-white">
      {value}
    </div>
  );
}

export default CountDownTimer;
