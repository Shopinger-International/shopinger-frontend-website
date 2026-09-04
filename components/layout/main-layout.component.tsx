import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
// types
import type { FC, ReactNode } from "react";
import type IUser from "@/types/user";

// local components
import Header from "@/components/header/header.component";
import BottomMobileNav from "@/components/common/bottom-mobile-nav.component";
import Footer from "@/components/footer/footer.component";
import LoginModal from "@/components/login/login-modal.component";
import SelectAddressDrawer from "@/components/common/select-address-drawer.component";
import AlertPopup from "@/components/common/alert-popup.component";

const AddAddressModal = dynamic(
  () =>
    import("@/components/manage-address/add-address-modal/add-address-modal.component"),
  {
    ssr: false,
  },
);

const MobileAddressModal = dynamic(
  () =>
    import("@/components/manage-address/add-address-modal/mobile-location-picker-dialog.component"),
  {
    ssr: false,
  },
);

// provider
import MegaMenuProvider from "@/provider/mega-menu-provider";
import CategoryDrawerProvider from "@/provider/category-drawer.provider";

// hooks
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";
import { useLoginModalContext } from "@/provider/login-modal-provider";
import { useLogoutModalContext } from "@/provider/logout-modal-provider";
import useLogoutMutation from "@/hooks/axios/login/use-logout-mutation.hook";

// context
import { FooterStateContext } from "@/context";

// helpers
import clsx from "clsx";
import { FaClosedCaptioning } from "react-icons/fa6";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--poppins",
});

const MainLayout: FC<{
  children: ReactNode;
  show_filter_sort_bar?: boolean;
  disable_side_filter?: boolean;
  show_bottom_navigation?: boolean;
}> = ({
  children,
  show_filter_sort_bar = false,
  disable_side_filter = false,
  show_bottom_navigation = false,
}) => {
    const logout_mutation = useLogoutMutation();
    const {
      is_drawer_open: is_adddress_drawer_open,
      is_modal_open: is_address_modal_open,
      closeModal: closeAddressModal,
      closeDrawer: closeAddressDrawer,
      data: address_data,
      updateState,
    } = useAddressDrawerContext();
    const login_modal_state = useLoginModalContext();
    const router = useRouter();
    const [login_popup_closed, setLoginPopupClosed] = useState(false);
useEffect(() => {
  if (!router.isReady) return;
const loginPopupShown = sessionStorage.getItem("login_popup_shown");
const loginPopupClosed = sessionStorage.getItem("login_popup_closed");

if (loginPopupShown || loginPopupClosed) return;

  if (router.pathname === "/") {
    const timer = setTimeout(() => {
      login_modal_state.openModal({});
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [router.isReady, router.pathname]);

useEffect(() => {
  if (!router.isReady) return;

  const loginPopupShown = sessionStorage.getItem("login_popup_shown");
  const loginPopupClosed = sessionStorage.getItem("login_popup_closed");

  if (loginPopupShown) {
    setLoginPopupClosed(false);
    return;
  }

  if (router.pathname !== "/" && loginPopupClosed) {
    setLoginPopupClosed(true);
  }
}, [router.isReady, router.pathname]);
    const logout_modal_state = useLogoutModalContext();

    const { show: show_footer } = useContext(FooterStateContext);
    const is_mobile = useIsMobile();

    const openLoginModal = () => {
      return new Promise<IUser>((resolve, reject) => {
        login_modal_state.openModal({
          onSuccess(user) {
            resolve(user as IUser);
          },
          onCancel() {
            reject();
          },
        });
      });
    };

    return (
      <div
        className={clsx(
          `${poppins.variable} ${poppins.className} relative min-h-screen bg-white text-gray-900 lg:mb-0`,
          show_bottom_navigation && "mb-16.5",
        )}
      >
      <Header
  show_filter_sort_bar={show_filter_sort_bar}
  disable_side_filter={disable_side_filter}
  is_bottom_navigation_showing={show_bottom_navigation}
  show_login_tooltip={login_popup_closed && router.pathname !== "/"}
  on_login_click={() => login_modal_state.openModal({})}
/>
        <main>
          <MegaMenuProvider />
          <CategoryDrawerProvider />
          <LoginModal
            open={login_modal_state.is_modal_open}
   handleClose={() => {
  sessionStorage.setItem("login_popup_closed", "true");
  setLoginPopupClosed(true);
  login_modal_state.onCancel?.();
  login_modal_state.closeModal();
}}
            handleOnSuccess={(user) => {
              sessionStorage.setItem("login_popup_shown", "true");
              login_modal_state.onSuccess?.(user);
              login_modal_state.closeModal();
            }}
          />
          <AlertPopup
            open={logout_modal_state.is_modal_open}
            title="Do you really want to logout?"
            handleConfirmation={() => {
              logout_mutation.mutate(undefined, {
                onSuccess: logout_modal_state.onSuccess,
              });
            }}
            handleCancellation={logout_modal_state.closeModal}
          />
          {is_mobile ? (
            <MobileAddressModal
              open={is_address_modal_open}
              onClose={closeAddressModal}
              initial_data={address_data ?? null}
              handleLogin={openLoginModal}
              handleOnSuccess={(address) => {
                updateState?.({
                  address_id: address.id,
                  data: null,
                });
                is_adddress_drawer_open && closeAddressDrawer();
              }}
            />
          ) : (
            <AddAddressModal
              open={is_address_modal_open}
              onClose={closeAddressModal}
              initial_data={address_data ?? null}
              handleLogin={openLoginModal}
              handleOnSuccess={(address) => {
                updateState?.({
                  address_id: address.id,
                  data: null,
                });
                is_adddress_drawer_open && closeAddressDrawer();
              }}
            />
          )}
          <SelectAddressDrawer />
          {children}
        </main>
        {show_bottom_navigation && <BottomMobileNav />}
        {show_footer && <Footer />}
      </div>
    );
  };

export default MainLayout;