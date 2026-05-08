import { createElement, Fragment, useEffect, useRef, useMemo } from "react";
import { createRoot, Root } from "react-dom/client";

// types
import type { Hit } from "instantsearch.js";
import type { IAlgoliaProduct } from "@/types/product";

// hooks
import { usePagination, useSearchBox } from "react-instantsearch";

// helpers
import {
  autocomplete,
  AutocompleteOptions,
  getAlgoliaResults,
} from "@algolia/autocomplete-js";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";

// local components
import SearchBarHit from "@/components/header/search-bar/search-bar-hit.component";

// const
import { search_client } from "@/components/header/search-bar/search-bar.component";
import { ALGOLIA_INDEX } from "@/constants/algolia.constant";

type AutocompleteItem = Hit<IAlgoliaProduct>;

type AutocompleteProps = Partial<AutocompleteOptions<AutocompleteItem>> & {
  className?: string;
};

const debouncePromise = <T,>(
  fn: (...args: any[]) => Promise<T>,
  delay: number,
) => {
  let timer: NodeJS.Timeout;

  return (...args: any[]): Promise<T> =>
    new Promise((resolve) => {
      clearTimeout(timer);

      timer = setTimeout(async () => {
        resolve(await fn(...args));
      }, delay);
    });
};

const debouncedSearch = debouncePromise(async (query: string) => {
  return getAlgoliaResults<Hit<IAlgoliaProduct>>({
    searchClient: search_client,
    queries: [
      {
        indexName: "products",
        params: {
          hitsPerPage: 5,
          query,
        },
      },
    ],
  });
}, 600);
function Autocomplete({ className, ...autocompleteProps }: AutocompleteProps) {
  const autocomplete_container_ref = useRef<HTMLDivElement>(null);
  const panel_container_ref = useRef<Root | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  const { refine: setQuery } = useSearchBox();
  const { refine: setPage } = usePagination();

  const plugins = useMemo(() => {
    const recent_searches = createLocalStorageRecentSearchesPlugin({
      key: "recent-search",
      limit: 4,
      transformSource({ source }) {
        return {
          ...source,
          templates: {
            ...source.templates,
            header() {
              return (
                <div className="text-sm font-semibold text-orange-500">
                  Recent Searches
                </div>
              );
            },
          },
          onSelect({ item }) {
            setQuery(item.label);
          },
        };
      },
    });
    const query_suggestions = createQuerySuggestionsPlugin({
      searchClient: search_client,
      indexName: ALGOLIA_INDEX.QUERIES,
      getSearchParams() {
        return recent_searches.data!.getAlgoliaSearchParams({
          hitsPerPage: 6,
        });
      },
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
          onSelect({ item }) {
            setQuery(item.query);
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

    return [recent_searches, query_suggestions];
  }, []);

  useEffect(() => {
    if (!autocomplete_container_ref.current) return;

    const autocomplete_instance = autocomplete({
      ...autocompleteProps,

      plugins,
      container: autocomplete_container_ref.current,

      initialState: {
        query: "",
      },

      classNames: {
        panel:
          "absolute left-0 right-0 mt-2 bg-white shadow-lg sm:!rounded-lg sm:border sm:border-gray-300 z-50 shadow-sm overflow-hidden",
        form: " sm:!border sm:!border-gray-300 !rounded-md outline-none focus-within:!shadow-none",
        list: "py-2 space-y-2",
        item: "px-4 py-2 cursor-pointer hover:bg-gray-100",
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
                return <SearchBarHit hit={item} />;
              },
            },
          },
        ];
      },

      onSubmit({ state }) {
        setQuery(state.query);
        setPage(0);
      },

      onReset() {
        setQuery("");
        setPage(0);
      },

      renderer: { createElement, Fragment, render: () => {} },

      render({ children }, root) {
        if (!panel_container_ref.current || rootRef.current !== root) {
          rootRef.current = root;

          panel_container_ref.current?.unmount();
          panel_container_ref.current = createRoot(root);
        }

        panel_container_ref.current.render(children);
      },
    });

    return () => autocomplete_instance.destroy();
  }, [autocompleteProps, setQuery, setPage]);

  return <div className={className} ref={autocomplete_container_ref} />;
}

export default Autocomplete;
