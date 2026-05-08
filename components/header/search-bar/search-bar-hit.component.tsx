import Image from "next/image";
// types
import type { FC } from "react";
import type { IAlgoliaProduct } from "@/types/product";
import type { Hit } from "instantsearch.js";
// local components

const SearchBarHit: FC<{
  hit: Hit<IAlgoliaProduct>;
}> = ({ hit }) => {
  console.log("value of hit", hit);
  return (
    <div className="flex w-full items-center gap-3">
      <div className="relative size-14 shrink-0 rounded-sm border border-gray-300">
        <Image
          src={hit.image}
          alt={hit.title}
          className="size-12 rounded border object-cover"
          fill={true}
        />
      </div>

      <div>
        <p className="line-clamp-1 text-sm font-medium">{hit.title}</p>
        <p className="w-full max-w-md truncate text-xs font-medium text-gray-900">
          {hit.category} &gt; {hit.sub_category} &gt; {hit.sub_sub_category}
        </p>
        <p className="text-xs text-gray-600">₹{hit.price}</p>
      </div>
    </div>
  );
};
export default SearchBarHit;
