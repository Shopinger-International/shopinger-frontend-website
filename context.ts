import { createContext } from "react";

export type IAddressDrawerState = {
  is_open: boolean;
  is_modal_open: boolean;
  address_id: number | null;
  updateState?: (payload: {
    open: boolean;
    is_modal_open: boolean;
    address_id: number | null;
  }) => void;
};

export type IFilterSortBarStateType = "sort" | "filter" | null;

type IFiltersSortBarState = {
  state: IFilterSortBarStateType;
  updateState?: (state: IFilterSortBarStateType) => void;
};

type IFooterState = {
  show: boolean;
  updateShow?:(val:boolean)=>void;
};

const AddressDrawerState = createContext<IAddressDrawerState>({
  is_open: false,
  is_modal_open: false,
  address_id: null,
});

const FiltersSortBarState = createContext<IFiltersSortBarState>({
  state: null,
});

const FooterStateContext = createContext<IFooterState>({
  show: true,
});

export { AddressDrawerState, FiltersSortBarState, FooterStateContext };
