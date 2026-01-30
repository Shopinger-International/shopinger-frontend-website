// types
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

// react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const query_client = new QueryClient();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <QueryClientProvider client={query_client}>
      {getLayout(<Component {...pageProps} />)}
    </QueryClientProvider>
  );
}
