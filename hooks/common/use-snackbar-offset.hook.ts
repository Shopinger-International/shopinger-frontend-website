import { useEffect } from "react";

export function useSnackbarOffset({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    enabled && document.body.classList.add("snackbar-offset");

    return () => {
      enabled && document.body.classList.remove("snackbar-offset");
    };
  }, [enabled]);
}
