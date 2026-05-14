import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import { useContext } from "react";
// types
import type { FC, ReactNode } from "react";

// local components
import Header from "@/components/header/header.component";
import Footer from "@/components/footer/footer.component";
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

// context
import { AddressDrawerState, FooterStateContext } from "@/context";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--poppins",
});

const MainLayout: FC<{
  children: ReactNode;
  show_filter_sort_bar?: boolean;
}> = ({ children, show_filter_sort_bar = false }) => {
  const { is_open, is_modal_open, address_id, updateState } =
    useContext(AddressDrawerState);
  const { show: show_footer } = useContext(FooterStateContext);
  const is_mobile = useIsMobile();
  return (
    <div
      className={`${poppins.variable} ${poppins.className} relative min-h-screen bg-white text-gray-900`}
    >
      <Header show_filter_sort_bar={show_filter_sort_bar} />
      <main>
        {is_mobile ? (
          <MobileAddressModal
            open={is_modal_open}
            onClose={() =>
              updateState?.({
                open: is_open,
                is_modal_open: false,
                address_id,
              })
            }
            initial_data={null}
            handleOnSuccess={(address) => {
              updateState?.({
                open: false,
                is_modal_open: false,
                address_id: address.id,
              });
            }}
          />
        ) : (
          <AddAddressModal
            open={is_modal_open}
            onClose={() =>
              updateState?.({
                open: is_open,
                is_modal_open: false,
                address_id,
              })
            }
            initial_data={null}
            handleOnSuccess={(address) => {
              console.log("new address id", address, address.id);
              updateState?.({
                open: false,
                is_modal_open: false,
                address_id: address.id,
              });
            }}
          />
        )}
        <SelectAddressDrawer />
        {children}
      </main>
      {show_footer && <Footer />}
    </div>
  );
};

export default MainLayout;
