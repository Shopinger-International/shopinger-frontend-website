"use client";
import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

import type { ICategory } from "@/hooks/axios/common/use-categories";

interface ICategoryContext {
  selected_category: ICategory | null;
  setSelectedCategory: (category: ICategory | null) => void;

  selected_sub_category: ICategory["sub_categories"][number] | null;
  setSelectedSubCategory: (
    sub_category: ICategory["sub_categories"][number] | null,
  ) => void;
}

const CategoryContext = createContext<ICategoryContext | undefined>(undefined);

export const SelectedCategoryProivder: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selected_category, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const [selected_sub_category, setSelectedSubCategory] = useState<
    ICategory["sub_categories"][number] | null
  >(null);

  return (
    <CategoryContext.Provider
      value={{
        selected_category,
        setSelectedCategory,
        selected_sub_category,
        setSelectedSubCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategoryContext must be used inside CategoryProvider");
  }

  return context;
};
