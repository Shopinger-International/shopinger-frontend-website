// types
import type { IAnalyticsEvent } from "@/types/analytics";

// lib
import analyticsAxios from "@/lib/axios/analytics.lib";

class AnalyticsService {
  private queue: Omit<IAnalyticsEvent, "id">[] = [];
  private is_flushing = false;

  track(event: Omit<IAnalyticsEvent, "id">) {
    console.log("value of this queue", this.queue);
    this.queue.push(event);

    if (this.queue.length >= 20) {
      this.flush();
    }
  }

  get getQueue() {
    return this.queue;
  }

  async flush() {
    if (this.is_flushing) return;
    if (this.queue.length === 0) return;

    this.is_flushing = true;

    const events = [...this.queue];

    try {
      await analyticsAxios.post("/add-analytics", {
        events,
      });

      this.queue.splice(0, events.length);
    } catch (error) {
      console.error(error);
    } finally {
      this.is_flushing = false;
    }
  }

  flushWithBeacon() {
    if (this.queue.length === 0) return;
    console.log("beacon run");
    const payload = JSON.stringify({
      events: this.queue,
    });

    const events = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/analytics/add-analytics`,
      events,
    );

    this.queue = [];
  }
}

export const analytics = new AnalyticsService();
