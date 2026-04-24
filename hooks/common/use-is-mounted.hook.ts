import { useState, useEffect } from "react";

const useIsMounted = () => {
  const [is_mounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return is_mounted;
};

export default useIsMounted;