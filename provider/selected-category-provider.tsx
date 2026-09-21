import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";

import type { ICategory } from "@/hooks/axios/common/use-categories";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

interface ICategoryContext {
  selected_category: ICategory | null;
  setSelectedCategory: (category: ICategory | null) => void;

  is_grocery: boolean;
  is_medicine: boolean;

  selected_sub_category: ICategory["sub_categories"][number] | null;
  setSelectedSubCategory: (
    sub_category: ICategory["sub_categories"][number] | null,
  ) => void;
}

const CategoryContext = createContext<ICategoryContext | undefined>(undefined);

export const SelectedCategoryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const path_name = usePathname();
  const [selected_category, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const is_grocery = selected_category?.name === "Grocery";
  const is_medicine = selected_category?.name === "Medicine";
  const [selected_sub_category, setSelectedSubCategory] = useState<
    ICategory["sub_categories"][number] | null
  >(null);

  useEffect(() => {}, [selected_category]);

  return (
    <CategoryContext.Provider
      value={{
        selected_category,
        setSelectedCategory,
        selected_sub_category,
        setSelectedSubCategory,
        is_grocery,
        is_medicine,
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
