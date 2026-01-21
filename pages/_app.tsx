import "@/styles/globals.css";
import type { AppProps } from "next/app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const query_client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={query_client}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </QueryClientProvider>
  );
}
