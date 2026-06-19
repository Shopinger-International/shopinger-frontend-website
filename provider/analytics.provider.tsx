import { useEffect } from "react";
import { analytics } from "@/services/analytics.service";

export default function AnalyticsProvider() {
  useEffect(() => {
    const interval = setInterval(() => {
      analytics.flush();
    }, 30000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        analytics.flushWithBeacon();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
