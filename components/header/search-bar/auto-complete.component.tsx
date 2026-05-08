import { createElement, Fragment, useEffect, useRef, useMemo } from "react";
import { createRoot, Root } from "react-dom/client";

// types
import type { Hit } from "instantsearch.js";

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
import { IAlgoliaProduct } from "@/types/product";

type AutocompleteItem = Hit<IAlgoliaProduct>;

type AutocompleteProps = Partial<AutocompleteOptions<AutocompleteItem>> & {
  className?: string;
};

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
        console.log("value transform source", source);
        return {
          ...source,
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
          "absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-xl border border-gray-300 z-50 shadow-sm",
        list: "py-2 space-y-2",
        item: "px-4 py-2 cursor-pointer hover:bg-gray-100",
      },

      getSources({ query }) {
        if (!query) return [];

        return [
          {
            sourceId: "products-data",
            getItems() {
              return getAlgoliaResults<Hit<IAlgoliaProduct>>({
                searchClient: search_client,
                queries: [
                  {
                    indexName: "products",
                    params: {
                      hitsPerPage: 5,
                    },
                  },
                ],
              });
            },

            templates: {
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
