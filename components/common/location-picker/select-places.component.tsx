import { useRef, useState } from "react";
//types
import type { FC } from "react";
import type { IPlace } from "@/types/address";

// external components
import AsyncSelect from "react-select/async";
import { components } from "react-select";

// icons
import { Search } from "lucide-react";

// helpers
import axios from "axios";

type IOptionType = {
  label: string;
  value: string;
  data: IPlace;
};

export const fetchPlaces = async (search_query: string) => {
  if (!search_query) return [];

  const { data } = await axios.post<{
    places: Array<IPlace>;
  }>(
    "https://places.googleapis.com/v1/places:searchText",
    {
      textQuery: search_query,
      regionCode: "IN",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_PLACES_API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.formattedAddress,places.location,places.addressComponents",
      },
    },
  );

  return data.places;
};

type IProps = {
  handleOnChange: (option: IOptionType) => void;
};

const SelectPlaces: FC<IProps> = ({ handleOnChange }) => {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<IOptionType | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadOptions = (input_value: string): Promise<IOptionType[]> => {
    return new Promise((resolve) => {
      // clear previous timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // set new timer
      timeoutRef.current = setTimeout(async () => {
        if (!input_value) return resolve([]);

        const places = await fetchPlaces(input_value);

        const options = places?.map((place) => ({
          label: place.formattedAddress,
          value: place.formattedAddress,
          data: place,
        }));

        resolve(options);
      }, 500);
    });
  };

  return (
    <AsyncSelect
      value={value} //
      inputValue={query}
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      onInputChange={(val, meta) => {
        if (meta.action === "input-change") {
          setQuery(val);
        }
      }}
      onChange={(val) => {
        handleOnChange(val as IOptionType);

        // clear both
        setValue(null);
        setQuery("");
      }}
      components={{ Control: CustomControl, IndicatorSeparator: () => null }}
      loadingMessage={() => "Searching locations..."}
      noOptionsMessage={() => "No locations found"}
      placeholder="Search location..."
    />
  );
};
export default SelectPlaces;

const CustomControl = (props: any) => {
  return (
    <components.Control {...props}>
      <div className="pl-4 text-gray-600">
        <Search className="size-5 text-gray-400" />
      </div>
      {props.children}
    </components.Control>
  );
};
