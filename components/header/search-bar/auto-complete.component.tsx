import { useRouter } from "next/router";
import { createElement, Fragment, useEffect, useRef, useMemo } from "react";
import { createRoot, Root } from "react-dom/client";

// types
import type { FC } from "react";
import type { Hit } from "instantsearch.js";
import type { IAlgoliaProduct } from "@/types/product";
import type { AutocompleteQuerySuggestionsHit } from "@algolia/autocomplete-plugin-query-suggestions/dist/esm/types";
import type { AlgoliaInsightsHit } from "@algolia/autocomplete-plugin-algolia-insights";
import type { RecentSearchesItem } from "@algolia/autocomplete-plugin-recent-searches/dist/esm/types";

// hooks
import { usePagination, useSearchBox } from "react-instantsearch";

// helpers
import {
  autocomplete,
  AutocompleteOptions,
  getAlgoliaResults,
} from "@algolia/autocomplete-js";
import { createRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import { debouncePromise } from "@/helpers/common.helper";
import { normalizeQuery } from "@/helpers/common.helper";
import { createAlgoliaInsightsPlugin } from "@algolia/autocomplete-plugin-algolia-insights";
import insightsClient from "search-insights";

// local components
import SearchBarHit from "@/components/header/search-bar/search-bar-hit.component";

// const
import { search_client } from "@/components/header/search-bar/search-bar.component";
import {
  ALGOLIA_INDEX,
  ALGOLIA_RECENT_SEARCH_ID,
} from "@/constants/algolia.constant";

// api hooks
import useCreateSearchQueryMutation from "@/hooks/axios/search/use-create-search-query-mutation.hook";
import useCategories from "@/hooks/axios/common/use-categories";

// icons
import { Timer, Trash2 } from "lucide-react";

type IAutocompleteItem = Hit<IAlgoliaProduct> & AlgoliaInsightsHit;

type AutocompleteProps = Partial<AutocompleteOptions<IAutocompleteItem>> & {
  className?: string;
};

type IAutocompleteSuggestion = AutocompleteQuerySuggestionsHit & {
  main_category: string;
  sub_category: string;
  sub_sub_category: string;
  main_category_slug: string;
  sub_category_slug: string;
  sub_sub_category_slug: string;
};

const debouncedSearch = debouncePromise(async (query: string) => {
  return getAlgoliaResults<IAutocompleteItem>({
    searchClient: search_client,
    queries: [
      {
        indexName: "products",
        params: {
          hitsPerPage: 5,
          query,
          clickAnalytics: true,
        },
      },
    ],
  });
}, 600);

function addRecentSearch(item: IAutocompleteSuggestion) {
  const raw = localStorage.getItem(ALGOLIA_RECENT_SEARCH_ID);
  const existing = (raw ? JSON.parse(raw) : []) as IAutocompleteSuggestion[];

  const filtered = existing.filter(
    (existing_item) => existing_item.objectID !== item.objectID,
  );
  const next = [item, ...filtered].slice(0, 5);
  localStorage.setItem(ALGOLIA_RECENT_SEARCH_ID, JSON.stringify(next));
}

insightsClient("init", {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
});
const AutoComplete: FC<AutocompleteProps> = ({
  className,
  ...auto_complete_props
}) => {
  const router = useRouter();
  const create_search_query_mutation = useCreateSearchQueryMutation();
  const autocomplete_container_ref = useRef<HTMLDivElement>(null);
  const panel_container_ref = useRef<Root | null>(null);
  const root_ref = useRef<HTMLElement | null>(null);

  const { refine: setQuery } = useSearchBox();
  const { refine: setPage } = usePagination();

  const plugins = useMemo(() => {
    const algolia_insights_plugin = createAlgoliaInsightsPlugin({
      insightsClient,
    });
    const recent_searches = createRecentSearchesPlugin<
      RecentSearchesItem & IAutocompleteSuggestion
    >({
      storage: {
        getAll(query) {
          if (typeof window === "undefined") return [];

          try {
            const raw = localStorage.getItem(ALGOLIA_RECENT_SEARCH_ID);
            const recent_searches = (
              raw ? JSON.parse(raw) : []
            ) as IAutocompleteSuggestion[];

            if (!query?.trim()) return recent_searches;

            const q = query.toLowerCase();

            return recent_searches.filter((item) => {
              // adjust field name based on your stored structure
              return item.query?.toLowerCase().includes(q);
            });
          } catch {
            return [];
          }
        },
        onAdd(item) {
          if (typeof window === "undefined") return;

          const raw = localStorage.getItem(ALGOLIA_RECENT_SEARCH_ID);
          const existing = (
            raw ? JSON.parse(raw) : []
          ) as IAutocompleteSuggestion[];

          const filtered = existing.filter(
            (existing_item) => existing_item.objectID !== item.objectID,
          );

          const next = [item, ...filtered].slice(0, 5);

          localStorage.setItem(ALGOLIA_RECENT_SEARCH_ID, JSON.stringify(next));
        },

        onRemove(object_id) {
          if (typeof window === "undefined") return;

          const raw = localStorage.getItem(ALGOLIA_RECENT_SEARCH_ID);
          if (!raw) return;

          const existing = JSON.parse(raw) as IAutocompleteSuggestion[];

          const updated = existing.filter(
            (item) => item.objectID !== object_id,
          );

          localStorage.setItem(
            ALGOLIA_RECENT_SEARCH_ID,
            JSON.stringify(updated),
          );
        },
      },
      transformSource({ source }) {
        return {
          ...source,
          templates: {
            item({ item }) {
              return (
                <div
                  onClick={() => {
                    router.replace(
                      `/categories/${item.main_category_slug}/${item.sub_category_slug}/${item.sub_sub_category_slug}`,
                    );
                  }}
                  className="aa-RecentSearchItem flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Timer className="aa-Icon size-5 text-gray-300" />
                    <span className="aa-QueryText">{item.query}</span>
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      recent_searches.data?.removeItem(item.objectID);
                    }}
                    className="cursor-pointer"
                  >
                    <Trash2 className="aa-Icon size-5 text-gray-300" />
                  </button>
                </div>
              );
            },
          },
        };
      },
    });
    const query_suggestions =
      createQuerySuggestionsPlugin<IAutocompleteSuggestion>({
        searchClient: search_client,
        indexName: ALGOLIA_INDEX.QUERIES,
        transformSource({ source }) {
          return {
            ...source,
            templates: {
              ...source.templates,
              header() {
                return (
                  <div className="text-sm font-semibold text-orange-500">
                    Suggested Searches
                  </div>
                );
              },
            },
            sourceId: "query-suggestions-plugin",
            onSelect({ item, navigator, state }) {
              setQuery(item.query);
              navigator.navigate({
                itemUrl: `/categories/${item.main_category_slug}/${item.sub_category_slug}/${item.sub_sub_category_slug}?query=${item.query}`,
                item,
                state,
              });
              addRecentSearch(item);
            },
            getItems(params) {
              if (!params.state.query) {
                return [];
              }
              return source.getItems(params);
            },
          };
        },
      });
    return [recent_searches, query_suggestions, algolia_insights_plugin];
  }, []);

  useEffect(() => {
    if (!autocomplete_container_ref.current) return;

    const autocomplete_instance = autocomplete({
      ...auto_complete_props,
      insights: true,
      plugins,

      container: autocomplete_container_ref.current,

      initialState: {
        query: "",
      },

      classNames: {
        panel:
          "absolute left-0 right-0 mt-2 bg-white shadow-lg sm:!rounded-lg sm:border sm:border-gray-300 z-50 shadow-sm overflow-hidden",
        form: "!border-none sm:!border sm:!border-gray-300 !rounded-md outline-none focus-within:!shadow-none",
        list: "py-2 space-y-1 w-full ",
        item: "!w-full hover:!bg-gray-100 hover:!rounded-lg !px-1",
      },

      getSources({ query }) {
        if (!query) return [];

        return [
          {
            sourceId: "products-data",
            getItems() {
              return debouncedSearch(query);
            },

            templates: {
              header() {
                return (
                  <div className="text-sm font-semibold text-orange-500">
                    Suggested Products
                  </div>
                );
              },
              item({ item }) {
                return (
                  <SearchBarHit
                    hit={item}
                    onClick={() => {
                      router.replace(item.url);
                      create_search_query_mutation.mutate({
                        object_id: `query-${normalizeQuery(query)
                          .toLowerCase()
                          .trim()
                          .replace(/\s+/g, "-")}`,
                        query,
                      });
                    }}
                  />
                );
              },
            },
          },
        ];
      },

      onSubmit({ state }) {
        const query = state.query;
        setQuery(query);
        create_search_query_mutation.mutate(
          {
            object_id: `query-${normalizeQuery(query)
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "-")}`,
            query,
          },
          {
            onSuccess(response) {
              router.replace(
                `/categories/${response.main_category.slug}/${response.sub_category.slug}/${response.sub_sub_category.slug}`,
              );
            },
          },
        );
        setPage(0);
      },

      onReset() {
        setQuery("");
        setPage(0);
      },

      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panel_container_ref.current || root_ref.current !== root) {
          root_ref.current = root;

          panel_container_ref.current?.unmount();
          panel_container_ref.current = createRoot(root);
        }

        panel_container_ref.current.render(children);
      },
    });

    const handleScroll = (event: Event) => {
      // Check if the scroll target is NOT inside the autocomplete panel
      const is_scrolling_inside_panel = root_ref.current?.contains(
        event.target as Node,
      );

      if (!is_scrolling_inside_panel) {
        autocomplete_instance.setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      autocomplete_instance.destroy();
    };
  }, [auto_complete_props, plugins]);

  return <div className={className} ref={autocomplete_container_ref} />;
};

export default AutoComplete;
