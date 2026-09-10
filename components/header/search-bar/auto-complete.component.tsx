import { useRouter } from "next/router";
import {
  createElement,
  Fragment,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import { createRoot, Root } from "react-dom/client";

// types
import type { FC } from "react";
import type { Hit } from "instantsearch.js";
import type { IAlgoliaProduct } from "@/types/product";
import type { AutocompleteQuerySuggestionsHit } from "@algolia/autocomplete-plugin-query-suggestions/dist/esm/types";
import type { AlgoliaInsightsHit } from "@algolia/autocomplete-plugin-algolia-insights";

// hooks
import { usePagination, useSearchBox } from "react-instantsearch";

// helpers
import clsx from "clsx";
import {
  autocomplete,
  AutocompleteOptions,
  getAlgoliaResults,
} from "@algolia/autocomplete-js";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import { debouncePromise } from "@/helpers/common.helper";
import { createAlgoliaInsightsPlugin } from "@algolia/autocomplete-plugin-algolia-insights";
import insightsClient from "@/lib/algolia/algolia-insight.lib";

// local components
import SearchBarHit from "@/components/header/search-bar/search-bar-hit.component";

// const
import { search_client } from "@/components/header/search-bar/search-bar.component";
import { ALGOLIA_INDEX } from "@/constants/algolia.constant";

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
        indexName: ALGOLIA_INDEX.PRODUCTS,
        params: {
          // hitsPerPage: 5,
          hitsPerPage: 20,
          query,
          clickAnalytics: true,
        },
      },
    ],
  });
}, 600);

const AutoComplete: FC<
  AutocompleteProps & {
    show_search_icon_only?: boolean;
    animate_categories: string[];
  }
> = ({
  className,
  show_search_icon_only,
  animate_categories,
  ...auto_complete_props
}) => {
  const router = useRouter();
  const autocomplete_container_ref = useRef<HTMLDivElement>(null);
  const panel_container_ref = useRef<Root | null>(null);
  const root_ref = useRef<HTMLElement | null>(null);

  //categories animation
  const [text, setText] = useState("");
  const [is_deleting, setIsDeleting] = useState(false);
  const [category_index, setCategoryIndex] = useState(0);

  const { refine: setQuery, query } = useSearchBox();
  const { refine: setPage } = usePagination();

  useEffect(() => {
    if (!animate_categories.length || query) return;
    console.log("current query : ", query);

    //start text animation if not started and completed
    if (!is_deleting && text === animate_categories[category_index]) {
      const deleting_text_timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);

      return () => clearTimeout(deleting_text_timeout);
    }

    //update the category if animation completed and start again
    if (is_deleting && text === "") {
      setIsDeleting(false);
      setCategoryIndex((prev) => (prev + 1) % animate_categories.length);
      return;
    }

    //decrease the length of text if deleting else increase
    const updating_text_timeout = setTimeout(() => {
      setText(
        is_deleting
          ? animate_categories[category_index].slice(0, text.length - 1)
          : animate_categories[category_index].slice(0, text.length + 1),
      );
    }, 150);
    return () => clearTimeout(updating_text_timeout);
  }, [animate_categories, query, is_deleting, category_index, text]);

  useEffect(() => {
    const input = autocomplete_container_ref.current?.querySelector(
      "input",
    ) as HTMLInputElement | null;

    if (!input) return;

    input.placeholder = "";
  }, []);
  const plugins = useMemo(() => {
    const algolia_insights_plugin = createAlgoliaInsightsPlugin({
      insightsClient,
    });

    const recent_searches = createLocalStorageRecentSearchesPlugin({
      key: "recent-search-plugin",
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
            router.push(`/search?query=${item.label}`);
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

            getSearchParams() {
              return recent_searches.data!.getAlgoliaSearchParams({
                hitsPerPage: 4,
              });
            },
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
              const query_id = item.__autocomplete_queryID;
              const index_name = item.__autocomplete_indexName;
              const object_id = item.objectID;
              router.push({
                pathname: `/categories/${item.main_category_slug}/${item.sub_category_slug}/${item.sub_sub_category_slug}`,
                query: {
                  query: item.query,
                  //@ts-ignore
                  query_id,
                  //@ts-ignore
                  index_name,
                  object_id,
                },
              });
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
    // return [recent_searches, query_suggestions, algolia_insights_plugin];
    return [algolia_insights_plugin];
  }, []);

  useEffect(() => {
    if (!autocomplete_container_ref.current) return;

    const autocomplete_instance = autocomplete({
      ...auto_complete_props,
      insights: true,
      openOnFocus: true,
      plugins,
      container: autocomplete_container_ref.current,

      initialState: {
        query: "",
      },

      classNames: {
        panel:
          "absolute left-0 right-0 mt-2 bg-white shadow-lg sm:!rounded-lg sm:border sm:border-gray-300 z-50 shadow-sm overflow-hidden",
        list: "py-2 space-y-1 w-full ",
        inputWrapper: "pl-2 sm:pl-3",
        submitButton: "md:!bg-orange-500",
        item: "!w-full hover:!bg-gray-100 hover:!rounded-lg !px-1",
        form: "!rounded-lg outline-none focus-within:!shadow-none focus-within:!border-none overflow-hidden  flex flex-row-reverse !border-none",
        detachedSearchButton: clsx(
          "!rounded-md !p-0 overflow-hidden !border-none flex !h-10",
          show_search_icon_only
            ? "!w-10 !min-w-10  items-center justify-center  [& > aa-DetachedSearchButtonPlaceholder]:hidden !bg-transparent"
            : "flex-row-reverse justify-between",
        ),
        detachedSearchButtonPlaceholder: "hidden",
        detachedSearchButtonIcon: show_search_icon_only
          ? "[&_svg]:!text-gray-900"
          : "!text-orange-500 bg-orange-500",
        detachedSearchButtonQuery: show_search_icon_only
          ? "hidden"
          : "pl-2 md:p-0",

        loadingIndicator:
          "md:!bg-orange-500  flex items-center justify-center md:[&_svg]:!stroke-white md:[&_svg_path]:!stroke-white md:[&_svg_circle]:!stroke-white",
      },

      getSources({ query }) {
        setQuery(query);
        return query
          ? [
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
                          const query_id = item.__autocomplete_queryID;
                          const index_name = item.__autocomplete_indexName;
                          const object_id = item.objectID;
                          router.push({
                            pathname: item.url,
                            query: {
                              query_id,
                              index_name,
                              object_id,
                            },
                          });
                        }}
                      />
                    );
                  },
                },
              },
            ]
          : [];
      },
      onSubmit({ state }) {
        setQuery(state.query);
        router.push(`/search?query=${state.query}`);
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
  }, [plugins]);

  return (
    <div className={clsx("relative", className)}>
      <div ref={autocomplete_container_ref} />

      {!query &&
        animate_categories.length > 0 &&
        animate_categories[category_index] !== "" && (
          <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-gray-400">
            Search "{text}"
          </div>
        )}
    </div>
  );
};

export default AutoComplete;
