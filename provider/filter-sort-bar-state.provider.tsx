import { useState } from "react";
// types
import type { FC, ReactNode } from "react";
import type { IFilterSortBarStateType } from "@/context";
// context
import { FiltersSortBarState } from "@/context";

const FiltersSortBarStateProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [filte_sort_bar_state, setFilterSortBarState] =
    useState<IFilterSortBarStateType>(null);
  return (
    <FiltersSortBarState.Provider
      value={{
        state: filte_sort_bar_state,
        updateState: (state) => setFilterSortBarState(state),
      }}
    >
      {children}
    </FiltersSortBarState.Provider>
  );
};
export default FiltersSortBarStateProvider;
