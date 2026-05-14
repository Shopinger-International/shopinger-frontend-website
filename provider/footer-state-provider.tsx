import { useState } from "react";
// types
import type { FC, ReactNode } from "react";

// context
import { FooterStateContext } from "@/context";

const FooterStateProvider: FC<{
  children: ReactNode;
  default_show: boolean;
}> = ({ default_show, children }) => {
  const [show, setShow] = useState(default_show);
  return (
    <FooterStateContext.Provider
      value={{
        show,
        updateShow: (val) => setShow(val),
      }}
    >
      {children}
    </FooterStateContext.Provider>
  );
};

export default FooterStateProvider;
