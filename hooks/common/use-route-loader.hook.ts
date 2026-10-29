import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useRouteLoader = (delay = 120) => {
  const router = useRouter();
  const [is_loading, set_is_loading] = useState(false);

  useEffect(() => {
    let timeout_id: ReturnType<typeof setTimeout> | undefined;

    const handle_start = () => {
      if (timeout_id) clearTimeout(timeout_id);

      timeout_id = setTimeout(() => {
        set_is_loading(true);
      }, delay);
    };

    const handle_end = () => {
      if (timeout_id) clearTimeout(timeout_id);

      timeout_id = undefined;
      set_is_loading(false);
    };

    router.events.on("routeChangeStart", handle_start);
    router.events.on("routeChangeComplete", handle_end);
    router.events.on("routeChangeError", handle_end);

    return () => {
      if (timeout_id) clearTimeout(timeout_id);

      router.events.off("routeChangeStart", handle_start);
      router.events.off("routeChangeComplete", handle_end);
      router.events.off("routeChangeError", handle_end);
    };
  }, [router.events, delay]);

  return is_loading;
};

export default useRouteLoader;
