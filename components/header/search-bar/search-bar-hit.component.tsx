import Image from "next/image";
// types
import type { FC } from "react";
import type { IAlgoliaProduct } from "@/types/product";
import type { Hit } from "instantsearch.js";

const SearchBarHit: FC<{
  hit: Hit<IAlgoliaProduct>;
  onClick: () => void;
}> = ({ hit, onClick }) => {
  return (
    <div
      className="flex w-full min-w-0 items-center gap-3 overflow-hidden"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-gray-300">
        <Image src={hit.image} alt={hit.title} fill className="object-cover" />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        {/* Title */}
        <p className="truncate text-sm font-medium">{hit.title}</p>

        {/* Category path */}
        <p className="truncate text-xs font-medium text-gray-900">
          {hit.category} &gt; {hit.sub_category} &gt; {hit.sub_sub_category}
        </p>

        {/* Price */}
        <p className="text-xs text-gray-600">₹{hit.price}</p>
      </div>
    </div>
  );
};

export default SearchBarHit;
