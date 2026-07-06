import { createContext } from "react";

export type IFilterSortBarStateType = "sort" | "filter" | null;

type IFiltersSortBarState = {
  state: IFilterSortBarStateType;
  updateState?: (state: IFilterSortBarStateType) => void;
};

type IFooterState = {
  show: boolean;
  updateShow?: (val: boolean) => void;
};

const FiltersSortBarState = createContext<IFiltersSortBarState>({
  state: null,
});

const FooterStateContext = createContext<IFooterState>({
  show: true,
});

export { FiltersSortBarState, FooterStateContext };
