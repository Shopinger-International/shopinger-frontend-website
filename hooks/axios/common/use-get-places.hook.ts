import { useQuery } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";

// helpers
import axios from "axios";

type IPlace = {
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

const useGetPlaces = (search_query: string) => {
  return useQuery<Array<IPlace>, AxiosError>({
    queryKey: ["google-places", search_query],
    async queryFn() {
      const { data } = await axios.post<{
        places: Array<IPlace>;
      }>(
        "https://places.googleapis.com/v1/places:searchText",
        {
          textQuery: search_query,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY,
            "X-Goog-FieldMask": "places.formattedAddress,places.location",
          },
        },
      );

      return data.places;
    },
  });
};
export default useGetPlaces;
