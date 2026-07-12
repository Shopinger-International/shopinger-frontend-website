import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import { useContext } from "react";
// types
import type { FC, ReactNode } from "react";
import type IUser from "@/types/user";

// local components
import Header from "@/components/header/header.component";
import BottomMobileNav from "@/components/common/bottom-mobile-nav.component";
import Footer from "@/components/footer/footer.component";
import LoginModal from "@/components/login/login-modal.component";
import SelectAddressDrawer from "@/components/common/select-address-drawer.component";

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

// hooks
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";
import { useLoginModalContext } from "@/provider/login-modal-provider";

// context
import { FooterStateContext } from "@/context";

// helpers
import clsx from "clsx";

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
  const {
    is_modal_open: is_address_modal_open,
    closeModal: closeAddressModal,
    closeDrawer: closeAddressDrawer,
    data: address_data,
    updateState,
  } = useAddressDrawerContext();
  const login_modal_state = useLoginModalContext();

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
      />
      <main>
        <LoginModal
          open={login_modal_state.is_modal_open}
          handleClose={() => {
            login_modal_state.onCancel?.();
            login_modal_state.closeModal();
          }}
          handleOnSuccess={(user) => {
            login_modal_state.onSuccess?.(user);
            login_modal_state.closeModal();
          }}
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
              closeAddressDrawer();
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
              closeAddressDrawer();
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
