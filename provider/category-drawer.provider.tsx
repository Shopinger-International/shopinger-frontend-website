import { useRouter } from "next/router";
// types
import type { FC } from "react";

// hooks
import useIsMounted from "@/hooks/common/use-is-mounted.hook";
import useUIHistory from "@/hooks/common/use-ui-history.hook";

// local components
import CategoryDrawer from "@/components/common/category-drawer.component";

export const useCategoryDrawerContext = () => {
  const router = useRouter();
  const is_mounted = useIsMounted();
  const { open, close } = useUIHistory();
  const is_drawer_open = is_mounted && router.query.category_drawer === "1";
  return {
    is_drawer_open,
    openDrawer: () =>
      open({
        category_drawer: "1",
      }),
    closeDrawer: close,
  };
};

const CategoryDrawerProvider: FC = () => {
  const { is_drawer_open, closeDrawer } = useCategoryDrawerContext();
  return <CategoryDrawer is_open={is_drawer_open} handleClose={closeDrawer} />;
};

export default CategoryDrawerProvider;
