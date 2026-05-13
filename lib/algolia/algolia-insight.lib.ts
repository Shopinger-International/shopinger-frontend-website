import insightsClient from "search-insights";

let initialized = false;

export const initInsights = () => {
  if (initialized) return;

  insightsClient("init", {
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
    apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
    useCookie: true,
  });

  initialized = true;
};

export default insightsClient;
