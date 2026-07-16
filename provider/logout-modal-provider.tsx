import { useRouter } from "next/router";
import { useState, useContext, createContext } from "react";
// types
import type { FC, ReactNode } from "react";

// hooks
import useUIHistory from "@/hooks/common/use-ui-history.hook";
import useIsMounted from "@/hooks/common/use-is-mounted.hook";

type IPayload = {
  onSuccess?: () => void;
};
const LogoutModalContext = createContext<
  IPayload & {
    updateState?: ({ onSuccess }: IPayload) => void;
  }
>({});

export const useLogoutModalContext = () => {
  const is_mounted = useIsMounted();
  const { onSuccess, updateState } = useContext(LogoutModalContext);
  const router = useRouter();
  const is_modal_open = is_mounted && router.query.logout_modal === "1";
  const { open, close } = useUIHistory();
  return {
    is_modal_open,
    openModal: ({ onSuccess }: { onSuccess?: () => void }) => {
      updateState?.({
        onSuccess,
      });
      open({
        logout_modal: "1",
      });
    },
    onSuccess: () => {
      onSuccess?.();
      close();
    },
    closeModal: () => {
      close();
      updateState?.({});
    },
  };
};

const LogoutModalProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [success_state, setSuccessState] = useState<{
    onSuccess?: () => void;
  }>({});
  return (
    <LogoutModalContext.Provider
      value={{
        onSuccess: success_state.onSuccess,
        updateState: ({ onSuccess }) => {
          setSuccessState({
            onSuccess,
          });
        },
      }}
    >
      {children}
    </LogoutModalContext.Provider>
  );
};
export default LogoutModalProvider;
