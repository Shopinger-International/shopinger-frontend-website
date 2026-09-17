import { useState, useContext } from "react";
import { createContext } from "react";

// types
import type { FC, ReactNode } from "react";
import type IUser from "@/types/user";

type ILoginModalState = {
  is_modal_open: boolean;
  title?: string;
  is_modal?: boolean;
  onSuccess?: (value: IUser) => void;
  onCancel?: () => void;
};

type ILoginModalContext = ILoginModalState & {
  updateState?: (payload: Partial<ILoginModalState>) => void;
};

const LoginModalContext = createContext<ILoginModalContext>({
  is_modal_open: false,
});

export const useLoginModalContext = () => {
  const data = useContext(LoginModalContext);
  return {
    openModal: (payload: Partial<ILoginModalState>) => {
      data.updateState?.({
        ...payload,
        is_modal_open: true,
      });
    },
    closeModal: () => {
      data.updateState?.({
        is_modal_open: false,
      });
    },
    ...data,
  };
};

const LoginModalProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [login_modal_state, setLoginModalState] = useState<ILoginModalState>({
    is_modal: true,
    is_modal_open: false,
  });
  return (
    <LoginModalContext.Provider
      value={{
        ...login_modal_state,
        updateState: (payload) => {
          console.log("value of payload", payload);
          setLoginModalState((prev) => ({
            ...prev,
            ...payload,
          }));
        },
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
};
export default LoginModalProvider;
