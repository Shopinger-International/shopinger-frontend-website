// types
import type { FC } from "react";
import type { HighlightProps } from "react-instantsearch";
import type { IAlgoliaProduct } from "@/types/product";
import type { Hit } from "instantsearch.js";

// external components
import { Highlight } from "react-instantsearch";

const CustomHighlight: FC<HighlightProps<Hit<IAlgoliaProduct>>> = (props) => {
  return (
    <Highlight
      {...props}
      classNames={{
        highlighted: "bg-orange-100 text-gray-900 font-medium",
      }}
    />
  );
};

export default CustomHighlight;
