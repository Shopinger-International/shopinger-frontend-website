import { useState, useRef, useLayoutEffect } from "react";
import { AxiosError } from "axios";
// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";
import type { SelectInstance } from "react-select";
import type IUser from "@/types/user";
import type { FormikProps } from "formik";

// icons
import { X, Home, Briefcase, MapPin } from "lucide-react";

// external components
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
  Fieldset,
  Legend,
} from "@headlessui/react";
import { Formik, Form } from "formik";

// local
import AddAddressInput from "@/components/manage-address/add-address-modal/add-address-input.component";
import LocationPicker from "@/components/common/map/location-picker/location-picker.component";
import SelectPlaces from "@/components/common/map/location-picker/select-places.component";
import Switch from "@/components/common/switch.component";

// helpers
import clsx from "clsx";
import {
  mapPlaceToForm,
  mapGeocodeToForm,
  getAddressFromCoords,
} from "@/helpers/address.helper";
import { enqueueSnackbar } from "notistack";

// const
import { ADDRESS_TYPE } from "@/constants/display-area.constant";

// hooks
import useCreateAddressMutation from "@/hooks/axios/address/use-create-address-mutation.hook";
import useUpdateAddressMutation from "@/hooks/axios/address/use-update-address-mutation.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useVerifyPincodeServiceability from "@/hooks/axios/product/use-verify-pincode-serviceability.hook";

const address_types = [
  { id: "home", label: "Home", icon: Home, value: ADDRESS_TYPE.HOME },
  { id: "work", label: "Work", icon: Briefcase, value: ADDRESS_TYPE.WORK },
  { id: "other", label: "Other", icon: MapPin, value: ADDRESS_TYPE.OTHER },
];

export type IFormAddressType = Omit<
  IAddress,
  "id" | "user_id" | "is_deleted" | "latitude" | "longitude"
> & {
  latitude: number | null;
  longitude: number | null;
};

type IProps = {
  open: boolean;
  initial_data?: IAddress | null;
  onClose: () => void;
  handleOnSuccess?: (data: IAddress) => void;
  handleLogin?: () => Promise<IUser>;
};

const MobileAddressModal: FC<IProps> = ({
  open,
  onClose,
  initial_data,
  handleOnSuccess,
  handleLogin,
}) => {
  const [bottom_bar_height, setBottomBarHeight] = useState(168); // in pixel;
  const formik_ref = useRef<FormikProps<IFormAddressType>>(null);
  const { data: user_detail } = useUserDetails();
  const user_addresses = user_detail?.user_addresses ?? [];
  const select_places_ref = useRef<SelectInstance>(null);
  const [show_drawer, setShowDrawer] = useState(false);
  const create_address_mutation = useCreateAddressMutation();
  const update_address_mutation = useUpdateAddressMutation();
  const [is_pincode_serviceable, setIsPincodeServiceable] = useState(true);
  const verify_pincode_serviceability_mutation =
    useVerifyPincodeServiceability();
  const { id: address_id, ...initial_values } = initial_data ?? {};

  useLayoutEffect(() => {
    const form_footer = document.getElementById("form-footer");
    if (!form_footer) return;

    const setHeight = () => {
      document.documentElement.style.setProperty(
        "--form-footer-height",
        `${form_footer.offsetHeight + 16}px`,
      );
    };

    setHeight();

    const observer = new ResizeObserver(setHeight);
    observer.observe(form_footer);

    return () => observer.disconnect();
  }, [show_drawer]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        getAddressFromCoords(latitude, longitude).then((data) => {
          const mapped = mapGeocodeToForm(data);
          verify_pincode_serviceability_mutation.mutate(
            {
              pin_code: mapped.pincode,
            },
            {
              onSuccess() {
                setIsPincodeServiceable(true);
                formik_ref.current?.setValues((prev) => ({
                  ...prev,
                  ...mapped,
                }));
              },
              onError(err) {
                setIsPincodeServiceable(false);
                let message = "Something went wrong";
                if (err instanceof AxiosError) {
                  message = err.response?.data?.message || message;
                }
                enqueueSnackbar(message, {
                  key: `verify-serviceable-pincode-error-${Date.now()}`,
                  variant: "error",
                });
              },
            },
          );
        });
      },
      () => alert("Unable to fetch location"),
    );
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0">
        <DialogPanel className="h-full w-full bg-white">
          <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
            <DialogTitle className="font-semibold text-orange-500">
              Add new address
            </DialogTitle>

            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
          <Formik<IFormAddressType>
            innerRef={formik_ref}
            initialValues={
              initial_data
                ? ({
                    ...initial_values,
                    delivery_instructions:
                      initial_data.delivery_instructions ?? "",
                  } as Omit<IAddress, "id">)
                : {
                    full_name: "",
                    phone: "",
                    house_number: "",
                    landmark: "",
                    place_id: "",
                    formatted_address: "",
                    area: "",
                    city: "",
                    state: "",
                    pincode: "",
                    latitude: null,
                    longitude: null,
                    address_type: ADDRESS_TYPE.HOME,
                    delivery_instructions: "",
                    is_default: user_addresses.length == 0 ? true : false,
                  }
            }
            onSubmit={async (values) => {
              let user = user_detail;

              if (!user_detail) {
                user = await handleLogin?.();
                if (!user) {
                  return;
                }
              }
              initial_data
                ? update_address_mutation.mutate(
                    {
                      address_id: initial_data.id,
                      payload: values,
                    },
                    {
                      onSuccess({ data }) {
                        onClose();
                        handleOnSuccess?.(data);
                      },
                    },
                  )
                : create_address_mutation.mutate(
                    {
                      ...values,
                    },
                    {
                      onSuccess({ data }) {
                        onClose();
                        handleOnSuccess?.(data);
                      },
                    },
                  );
            }}
          >
            {({ values, setFieldValue, setValues }) => (
              <Form className="h-full">
                <div className="relative h-full w-full">
                  {/* MAP */}
                  <div className="absolute inset-0">
                    <LocationPicker
                      position={{
                        lat: values.latitude,
                        lng: values.longitude,
                      }}
                      updatePosition={(coords) => {
                        setFieldValue("latitude", coords.lat);
                        setFieldValue("longitude", coords.lng);
                      }}
                    />
                  </div>

                  {/* SEARCH */}
                  <div className="absolute top-4 z-20 w-full px-4">
                    <SelectPlaces
                      ref={select_places_ref}
                      handleOnChange={(val) => {
                        const mapped = mapPlaceToForm(val.data);
                        verify_pincode_serviceability_mutation.mutate(
                          {
                            pin_code: mapped.pincode,
                          },
                          {
                            onSuccess() {
                              setIsPincodeServiceable(true);
                              setValues((prev) => ({
                                ...prev,
                                ...mapped,
                                latitude: val.data.location.latitude,
                                longitude: val.data.location.longitude,
                              }));
                            },
                            onError() {
                              setIsPincodeServiceable(false);
                            },
                          },
                        );
                      }}
                    />
                  </div>

                  {/* CURRENT LOCATION */}
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-orange-500 shadow-sm"
                    style={{
                      bottom: `${bottom_bar_height}px`,
                    }}
                  >
                    <MapPin
                      className="size-3.5 text-orange-500"
                      strokeWidth={2.5}
                    />
                    <span>Use Current Location</span>
                  </button>
                  <div
                    ref={(node) => {
                      const resize_oveserver = new ResizeObserver((entries) => {
                        for (let entry of entries) {
                          const height = entry.contentRect.height;
                          setBottomBarHeight(height + 100);
                        }
                      });
                      node && resize_oveserver.observe(node);
                      return () => {
                        resize_oveserver.disconnect();
                      };
                    }}
                    className="fixed bottom-0 z-30 w-full space-y-2 border-t border-gray-300 bg-white p-4 shadow-sm"
                  >
                    <div className="space-y-2">
                      {!is_pincode_serviceable && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 rounded-full bg-red-100 p-1">
                              <MapPin className="size-3.5 text-red-500" />
                            </div>

                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-600">
                                Location not serviceable
                              </p>

                              <p className="mt-0.5 text-xs leading-relaxed text-red-500">
                                We’re not delivering to this area yet. Try
                                another nearby address or use your current
                                location.
                              </p>

                              <button
                                type="button"
                                onClick={handleUseCurrentLocation}
                                className="mt-2 text-xs font-semibold text-orange-500"
                              >
                                Use current location
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {values.formatted_address && is_pincode_serviceable ? (
                        <>
                          <p className="text-sm leading-snug font-semibold">
                            {values.formatted_address}
                          </p>
                        </>
                      ) : (
                        <div className="text-sm font-medium text-gray-600">
                          Select a location on map to continue
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="w-full rounded-md bg-orange-500 py-2 font-semibold text-white shadow-sm disabled:bg-orange-300"
                      disabled={!values.pincode || !is_pincode_serviceable}
                      onClick={() => setShowDrawer(true)}
                    >
                      Confirm & Proceed
                    </button>
                  </div>

                  {/* DRAWER */}
                  {show_drawer && (
                    <>
                      <div
                        className="fixed bottom-0 z-30 h-screen w-screen bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDrawer(false);
                        }}
                      />
                      <div className="fixed bottom-0 z-40 max-h-[80vh] w-full overflow-y-auto rounded-t-2xl border border-gray-300 bg-white shadow-xl">
                        <div className="relative space-y-6 p-4 pb-(--form-footer-height)">
                          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
                          {/* Close CTA */}
                          <button
                            type="button"
                            onClick={() => setShowDrawer(false)}
                            className="absolute top-3 right-3 rounded-full p-2 text-gray-500 hover:bg-gray-100"
                          >
                            <X className="size-5" />
                          </button>
                          <Fieldset className="space-y-3">
                            <Legend className="text-sm font-medium">
                              Save Address as
                            </Legend>

                            <div className="flex gap-2">
                              {address_types.map(
                                ({ id, label, icon: Icon, value }) => {
                                  const isActive =
                                    values.address_type === value;
                                  return (
                                    <button
                                      key={id}
                                      type="button"
                                      onClick={() =>
                                        setFieldValue("address_type", value)
                                      }
                                      className={clsx(
                                        "flex items-center gap-2 rounded-lg border px-3 py-1 text-sm",
                                        isActive
                                          ? "border-orange-500 text-orange-500"
                                          : "border-gray-300",
                                      )}
                                    >
                                      <Icon className="size-4" />
                                      {label}
                                    </button>
                                  );
                                },
                              )}
                            </div>

                            <AddAddressInput
                              name="house_number"
                              placeholder="House No."
                            />
                            <AddAddressInput
                              name="landmark"
                              placeholder="Landmark"
                            />
                            <AddAddressInput
                              name="area"
                              placeholder="Area / Locality"
                              handleOnClick={() => {
                                select_places_ref.current?.focus();
                                setShowDrawer(false);
                              }}
                            />
                            <AddAddressInput
                              name="phone"
                              placeholder="Phone"
                              type="tel"
                            />
                            <AddAddressInput
                              name="full_name"
                              placeholder="Full Name"
                            />
                          </Fieldset>
                          <Fieldset className="space-y-2">
                            <Legend className="text-sm font-medium">
                              Delivery Instructions
                            </Legend>

                            <AddAddressInput
                              name="delivery_instructions"
                              type="textarea"
                              placeholder="Eg. Call before delivery (Optional)"
                            />

                            <Switch
                              label="Set as default address"
                              description="This will be used for all future orders by default"
                              name="is_default"
                              disabled={
                                user_addresses.length == 0 ? true : false
                              }
                            />
                          </Fieldset>
                        </div>
                        <div
                          id="form-footer"
                          className="fixed bottom-0 w-full shrink-0 space-y-2 border-t border-gray-300 bg-white p-4"
                        >
                          {/* Selected Location Hint */}
                          {values.formatted_address ? (
                            <p className="text-sm leading-snug font-semibold">
                              {values.formatted_address}
                            </p>
                          ) : (
                            <div className="text-xs text-gray-600">
                              Select a location on map to continue
                            </div>
                          )}

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={
                              create_address_mutation.isPending ||
                              update_address_mutation.isPending
                            }
                            className="w-full rounded-md bg-orange-500 px-6 py-2 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                          >
                            {update_address_mutation.isPending
                              ? "Updating..."
                              : create_address_mutation.isPending
                                ? "Saving..."
                                : initial_data
                                  ? "Update Address"
                                  : "Add Address"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default MobileAddressModal;
