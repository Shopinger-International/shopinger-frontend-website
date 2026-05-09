// types
import type { FC } from "react";

// external components
import { InstantSearch, Configure } from "react-instantsearch";

// local components
import AutoComplete from "@/components/header/search-bar/auto-complete.component";

// helpers
import { liteClient as algoliasearch } from "algoliasearch/lite";

// const
import { ALGOLIA_INDEX } from "@/constants/algolia.constant";

export const search_client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);

const SearchBar: FC = () => {
  return (
    <div className="relative w-full">
      <InstantSearch
        searchClient={search_client}
        indexName={ALGOLIA_INDEX.PRODUCTS}
        stalledSearchDelay={500}
      >
        <AutoComplete
          placeholder="Search Products..."
          className="relative w-full rounded-lg bg-white"
        />

        <Configure hitsPerPage={10} />
      </InstantSearch>
    </div>
  );
};

export default SearchBar;
