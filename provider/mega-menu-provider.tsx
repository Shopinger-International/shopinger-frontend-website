import { useRouter } from "next/router";

// types
import type { FC } from "react";

// local components
import MegaMenu from "@/components/common/mega-menu.component";

// hooks
import useIsMounted from "@/hooks/common/use-is-mounted.hook";
import useUIHistory from "@/hooks/common/use-ui-history.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";

export const useMegaMenuContext = () => {
  const is_mounted = useIsMounted();
  const router = useRouter();
  const { open, close } = useUIHistory();
  const is_drawer_open = is_mounted && router.query.mega_menu_drawer === "1";
  return {
    is_drawer_open,
    openDrawer: () =>
      open({
        mega_menu_drawer: "1",
      }),
    closeDrawer: close,
  };
};

const MegaMenuProvider: FC = () => {
  const { openModal: openLoginModal } = useLoginModalContext();
  const {
    is_drawer_open: is_mega_menu_drawer_open,
    closeDrawer: closeMegaMenuDrawer,
  } = useMegaMenuContext();
  return (
    <MegaMenu
      is_open={is_mega_menu_drawer_open}
      handleClose={() => {
        closeMegaMenuDrawer();
      }}
      handleShowLoginModal={() =>
        openLoginModal({
          onSuccess() {
            closeMegaMenuDrawer();
          },
        })
      }
    />
  );
};
export default MegaMenuProvider;
