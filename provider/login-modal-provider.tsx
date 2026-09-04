import { useState, useContext, createContext } from "react";

// types
import type { FC, ReactNode } from "react";
import type IUser from "@/types/user";

// hooks

type ILoginModalState = {
  onSuccess?: (value: IUser) => void;
  onCancel?: () => void;
};

type ILoginModalContext = ILoginModalState & {
  is_modal_open: boolean;
  setIsModalOpen: (value: boolean) => void;
  updateState?: (payload: Partial<ILoginModalState>) => void;
};

const LoginModalContext = createContext<ILoginModalContext>({
  is_modal_open: false,
  setIsModalOpen: () => {},
});

export const useLoginModalContext = () => {
  const data = useContext(LoginModalContext);

return {
  ...data,

  openModal: (payload: Partial<ILoginModalState>) => {
    data.setIsModalOpen(true);
    data.updateState?.(payload);
  },

  closeModal: () => {
    data.setIsModalOpen(false);
    data.updateState?.({});
  },
};
};

const LoginModalProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [login_modal_state, setLoginModalState] =
    useState<ILoginModalState>({});

  const [is_modal_open, setIsModalOpen] = useState(false);

  return (
    <LoginModalContext.Provider
      value={{
        ...login_modal_state,
        is_modal_open,
        setIsModalOpen,
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