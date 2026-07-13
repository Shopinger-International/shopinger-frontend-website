import { useRouter } from "next/router";

const useUIHistory = () => {
  const router = useRouter();

  const open = (params: Record<string, string>) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          ...params,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );
  };

  const close = () => {
    router.back();
  };

  return {
    open,
    close,
  };
};

export default useUIHistory;