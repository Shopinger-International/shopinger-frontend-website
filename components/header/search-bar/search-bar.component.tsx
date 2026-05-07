// types
import type { FC } from "react";

// external components
import { InstantSearch, Configure, RefinementList } from "react-instantsearch";

// local components
import SearchBarContent from "@/components/header/search-bar/search-bar-content.component";

// helpers
import { liteClient as algoliasearch } from "algoliasearch/lite";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);

const SearchBar: FC = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="products"
      stalledSearchDelay={500}
    >
      <Configure analytics={false} hitsPerPage={40} />
      {/* <RefinementList
        attribute="category" // Must be set to faceting in dashboard
        limit={10}
        showMore={true}
      /> */}
      <SearchBarContent />
    </InstantSearch>
  );
};

export default SearchBar;
