import Script from "next/script";
import { useState } from "react";
import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";
// types
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

// provider
import { SnackbarProvider } from "notistack";
import SelectedAddressProvider from "@/provider/selected-address-provider.component";
import LoginModalProvider from "@/provider/login-modal-provider";
import AlgoliaInsightsProvider from "@/provider/algolia-insights-provider";
import AnalyticsProvider from "@/provider/analytics.provider";
import LogoutModalProvider from "@/provider/logout-modal-provider";

// react query
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";

// helpers
import createOrganizationJSONLD from "@/seo/organization.jsonld";

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
  const json_ld = createOrganizationJSONLD();
  return (
    <>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(json_ld),
        }}
      />
      <QueryClientProvider client={query_client}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <AlgoliaInsightsProvider>
            <AnalyticsProvider />
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
                <LoginModalProvider>
                  <LogoutModalProvider>
                    {getLayout(<Component {...pageProps} />)}
                  </LogoutModalProvider>
                </LoginModalProvider>
              </SelectedAddressProvider>
            </SnackbarProvider>
          </AlgoliaInsightsProvider>
        </HydrationBoundary>

        {process.env.NODE_ENV == "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        <SpeedInsights />
      </QueryClientProvider>
    </>
  );
}
