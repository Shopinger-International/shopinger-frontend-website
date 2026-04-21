import { useEffect } from "react";
import { useRouter } from "next/router";
// types
import type { FC, ReactNode } from "react";

// api hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

const ProtectedLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const { data: user_details, isPending } = useUserDetails();
  const is_logged_in = !!user_details;
  useEffect(() => {
    if (isPending) return;
    if (!is_logged_in) {
      router.replace("/login");
    }
  }, [is_logged_in, isPending]);

  return <>{children}</>;
};

export default ProtectedLayout;
