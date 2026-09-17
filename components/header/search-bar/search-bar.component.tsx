// types
import type { FC } from "react";

// external components
import { InstantSearch, Configure } from "react-instantsearch";

// local components
import AutoComplete from "@/components/header/search-bar/auto-complete.component";

// helpers
import { liteClient as algoliasearch } from "algoliasearch/lite";
import clsx from "clsx";

// const
import { ALGOLIA_INDEX } from "@/constants/algolia.constant";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";

export const search_client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);

type IProps = {
  show_search_icon_only?: boolean;
};

const SearchBar: FC<IProps> = ({ show_search_icon_only = false }) => {
  const { data: categories = [] } = useCategories(true, "main");
  const animate_categories = categories.map((category) => {
    return category.name;
  });
  return (
    <div className={clsx("relative", !show_search_icon_only && "w-full")}>
      <InstantSearch
        searchClient={search_client}
        indexName={ALGOLIA_INDEX.PRODUCTS}
        stalledSearchDelay={500}
        insights={true}
      >
        <AutoComplete
          animate_categories={animate_categories}
          show_search_icon_only={show_search_icon_only}
          className={clsx(
            "relative rounded-lg",
            show_search_icon_only ? "bg-transparent" : "w-full bg-white",
          )}
        />

        <Configure hitsPerPage={10} />
      </InstantSearch>
    </div>
  );
};

export default SearchBar;
