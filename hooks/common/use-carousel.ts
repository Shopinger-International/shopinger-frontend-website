import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

export const useCarousel = () => {
  const [embla_ref, embla_api] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [can_scroll_prev, setCanScrollPrev] = useState(false);
  const [can_scroll_next, setCanScrollNext] = useState(false);
  const goToPrev = useCallback(() => {
    embla_api?.scrollPrev();
  }, [embla_api]);

  const goToNext = useCallback(() => {
    embla_api?.scrollNext();
  }, [embla_api]);
  useEffect(() => {
    if (!embla_api) return;

    const updateScrollButtons = () => {
      setCanScrollPrev(embla_api.canScrollPrev());
      setCanScrollNext(embla_api.canScrollNext());
    };

    updateScrollButtons();

    embla_api.on("select", updateScrollButtons);
    embla_api.on("reInit", updateScrollButtons);

    return () => {
      embla_api.off("select", updateScrollButtons);
      embla_api.off("reInit", updateScrollButtons);
    };
  }, [embla_api]);
  return {
    goToNext,
    goToPrev,
    can_scroll_next,
    can_scroll_prev,
    ref: embla_ref,
  };
};
