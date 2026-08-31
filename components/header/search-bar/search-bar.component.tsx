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

export const search_client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);

type IProps = {
  show_search_icon_only?: boolean;
};

const SearchBar: FC<IProps> = ({ show_search_icon_only = false }) => {
  return (
    <div className={clsx("relative", !show_search_icon_only && "w-full")}>
      <InstantSearch
        searchClient={search_client}
        indexName={ALGOLIA_INDEX.PRODUCTS}
        stalledSearchDelay={500}
        insights={true}
      >
        <AutoComplete
          placeholder="Search 30,000+ products"
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
