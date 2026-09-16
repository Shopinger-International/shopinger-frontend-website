import { useContext, useState } from "react";
import { createContext } from "react";
// types
import type { FC, ReactNode } from "react";

// local components
import CategoryDrawer from "@/components/common/category-drawer.component";

type ICategoryDrawerContext = {
  is_drawer_open: boolean;
  updateDrawerState?: (val: boolean) => void;
};

const CategoryDrawerContext = createContext<ICategoryDrawerContext>({
  is_drawer_open: false,
});

export const useCategoryDrawerContext = () => {
  const { is_drawer_open, updateDrawerState } = useContext(
    CategoryDrawerContext,
  );
  return {
    is_drawer_open,
    openDrawer: () => updateDrawerState?.(true),
    closeDrawer: () => updateDrawerState?.(false),
  };
};

const CategoryDrawerProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [category_drawer_state, setCategoryDrawerState] = useState({
    is_drawer_open: false,
  });
  return (
    <CategoryDrawerContext.Provider
      value={{
        ...category_drawer_state,
        updateDrawerState: (val) =>
          setCategoryDrawerState((prev) => ({
            ...prev,
            is_drawer_open: val,
          })),
      }}
    >
      <CategoryDrawer
        is_open={category_drawer_state.is_drawer_open}
        handleClose={() => setCategoryDrawerState({ is_drawer_open: false })}
      />
      {children}
    </CategoryDrawerContext.Provider>
  );
};

export default CategoryDrawerProvider;
