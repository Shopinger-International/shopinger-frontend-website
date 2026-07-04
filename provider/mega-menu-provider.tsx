import { useState, useContext, useEffect } from "react";
import { createContext } from "react";

// types
import type { FC, ReactNode } from "react";

// local components
import MegaMenu from "@/components/common/mega-menu.component";
import LoginModal from "@/components/login/login-modal.component";

interface IMegaMenuState {
  is_open: boolean;
  updateState?: (val: boolean) => void;
}

const MegaMenuContext = createContext<IMegaMenuState>({
  is_open: false,
});

export const useMegaMenuContext = () => {
  const { is_open, updateState } = useContext(MegaMenuContext);
  return { is_open, updateState };
};

interface IProps {
  children: ReactNode;
}
const MegaMenuProvider: FC<IProps> = ({ children }) => {
  const [login_modal_state, setLoginModalState] = useState<{
    open: boolean;
  }>({
    open: false,
  });
  const [is_open, setIsOpen] = useState(false);

  useEffect(() => {
    if (!login_modal_state.open && !is_open) return;
    const handlePopState = () => {
      if (login_modal_state.open) {
        setLoginModalState({
          open: false,
        });
        return;
      }
      if (is_open) {
        setIsOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [login_modal_state.open, is_open]);
  return (
    <MegaMenuContext.Provider
      value={{
        is_open,
        updateState: (val) => {
          val && history.pushState({ mega_menu: true }, "");
          setIsOpen(val);
        },
      }}
    >
      <MegaMenu
        is_open={is_open}
        handleClose={() => history.back()}
        handleShowLoginModal={() => {
          history.pushState(
            {
              login_modal: true,
            },
            "",
          );
          setLoginModalState({
            open: true,
          });
        }}
      />
      <LoginModal
        open={login_modal_state.open}
        handleClose={() => {
          history.back();
        }}
        handleOnSuccess={(user) => {
          history.back();
        }}
      />
      {children}
    </MegaMenuContext.Provider>
  );
};
export default MegaMenuProvider;
