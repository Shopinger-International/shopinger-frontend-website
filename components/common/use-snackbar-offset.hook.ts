import { useEffect } from "react";

export function useSnackbarOffset() {
  useEffect(() => {
    document.body.classList.add("snackbar-offset");

    return () => {
      document.body.classList.remove("snackbar-offset");
    };
  }, []);
}