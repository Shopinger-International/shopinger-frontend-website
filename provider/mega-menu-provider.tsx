import { createContext } from "react";
import { useContext, useState } from "react";

// types
import type { FC, ReactNode } from "react";

// local components
import MegaMenu from "@/components/common/mega-menu.component";

// hooks
import { useLoginModalContext } from "@/provider/login-modal-provider";

type IMegaMenuContext = {
  is_drawer_open: boolean;
  updateState?: (val: boolean) => void;
};

const MegaMenuContext = createContext<IMegaMenuContext>({
  is_drawer_open: false,
});

export const useMegaMenuContext = () => {
  const { is_drawer_open, updateState } = useContext(MegaMenuContext);
  return {
    is_drawer_open,
    openDrawer: () => updateState?.(true),
    closeDrawer: () => updateState?.(false),
  };
};

const MegaMenuProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { openModal: openLoginModal } = useLoginModalContext();
  const [mega_menu_drawer_state, setMegaMenuDrawerState] = useState({
    is_drawer_open: false,
  });
  return (
    <MegaMenuContext.Provider
      value={{
        ...mega_menu_drawer_state,
        updateState(val) {
          setMegaMenuDrawerState({
            is_drawer_open: val,
          });
        },
      }}
    >
      <MegaMenu
        is_open={mega_menu_drawer_state.is_drawer_open}
        handleClose={() => {
          setMegaMenuDrawerState({
            is_drawer_open: false,
          });
        }}
        handleShowLoginModal={() => {
          openLoginModal({
            is_modal: true,
            title: "Login for better experience",
            onSuccess() {
              setMegaMenuDrawerState({
                is_drawer_open: false,
              });
            },
            onCancel() {},
          });
        }}
      />
      {children}
    </MegaMenuContext.Provider>
  );
};
export default MegaMenuProvider;
