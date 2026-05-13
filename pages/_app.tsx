import { useState } from "react";
import dynamic from "next/dynamic";
// types
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

// provider
import { SnackbarProvider } from "notistack";
import SelectedAddressProvider from "@/provider/selected-address-provider.component";
import AlgoliaInsightsProvider from "@/provider/algolia-insights-provider";

// react query
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then(
            (mod) => mod.ReactQueryDevtools,
          ),
        { ssr: false },
      )
    : () => null;

// local components
import {
  SuccessSnackbar,
  ErrorSnackbar,
} from "@/components/common/snackbar.component";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [query_client] = useState(() => new QueryClient());
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <QueryClientProvider client={query_client}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <AlgoliaInsightsProvider>
          <SnackbarProvider
            autoHideDuration={3000}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
            Components={{
              success: SuccessSnackbar,
              error: ErrorSnackbar,
            }}
          >
            <SelectedAddressProvider>
              {getLayout(<Component {...pageProps} />)}
            </SelectedAddressProvider>
          </SnackbarProvider>
        </AlgoliaInsightsProvider>
      </HydrationBoundary>

      {process.env.NODE_ENV == "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
