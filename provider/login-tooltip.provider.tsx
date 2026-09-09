import { useContext, useState, useEffect } from "react";
import { createContext } from "react";

// types
import type { FC, ReactNode } from "react";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import { useLoginModalContext } from "./login-modal-provider";

type ILoginTooltipContext = {
  show_tooltip: boolean;
  updateState?: (val: boolean) => void;
};

const LoginTooltipContext = createContext<ILoginTooltipContext>({
  show_tooltip: false,
});

export const useLoginTooltipContext = () => {
  const data = useContext(LoginTooltipContext);
  return data;
};

const LoginTooltipProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { data: user_details, isPending: is_pending } = useUserDetails();
  const { is_modal_open: is_login_modal_open } = useLoginModalContext();
  const is_logged_in = !!user_details;
  const [show_tooltip, setShowTooltip] = useState(false);
  const is_mobile = useIsMobile();

  useEffect(() => {
    if (is_pending || is_logged_in || is_mobile) return;
    setShowTooltip(true);
    const timeout = setTimeout(() => {
      setShowTooltip(false);
    }, 20000);
    return () => clearInterval(timeout);
  }, [is_logged_in, is_pending, is_mobile]);

  useEffect(() => {
    is_login_modal_open && setShowTooltip(false);
  }, [is_login_modal_open]);
  useEffect(() => {
    is_logged_in && setShowTooltip(false);
  }, [is_logged_in]);
  return (
    <LoginTooltipContext.Provider
      value={{
        show_tooltip,
        updateState: (val) => setShowTooltip(val),
      }}
    >
      {children}
    </LoginTooltipContext.Provider>
  );
};

export default LoginTooltipProvider;
