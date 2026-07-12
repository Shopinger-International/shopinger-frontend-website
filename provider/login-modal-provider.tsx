import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { createContext } from "react";

// types
import type { FC, ReactNode } from "react";

// hooks
import useUIHistory from "@/hooks/common/use-ui-history.hook";

type ILoginModalState = {
  onSuccess?: (value: unknown) => void;
  onCancel?: () => void;
};

type ILoginModalContext = ILoginModalState & {
  updateState?: (payload: Partial<ILoginModalState>) => void;
};

const LoginModalContext = createContext<ILoginModalContext>({});

export const useLoginModalContext = () => {
  const router = useRouter();
  const data = useContext(LoginModalContext);
  const is_modal_open = router.query.login_modal === "1";
  const { open, close } = useUIHistory();
  return {
    is_modal_open,
    openModal: (payload: Partial<ILoginModalState>) => {
      open({
        login_modal: "1",
      });
      data.updateState?.(payload);
    },
    closeModal: () => {
      close();
      data.updateState?.({});
    },
    ...data,
  };
};

const LoginModalProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [login_modal_state, setLoginModalState] = useState<ILoginModalState>(
    {},
  );
  return (
    <LoginModalContext.Provider
      value={{
        ...login_modal_state,
        updateState: (payload) =>
          setLoginModalState((prev) => ({
            ...prev,
            ...payload,
          })),
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
};
export default LoginModalProvider;
