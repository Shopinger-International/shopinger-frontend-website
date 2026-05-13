import { useEffect } from "react";
// types
import type { FC, ReactNode } from "react";

// lib
import { initInsights } from "@/lib/algolia/algolia-insight.lib";

const AlgoliaInsightsProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  useEffect(() => {
    initInsights();
  }, []);
  return <>{children}</>;
};

export default AlgoliaInsightsProvider;
