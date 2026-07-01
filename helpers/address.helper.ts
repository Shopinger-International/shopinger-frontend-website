import type { IPlace } from "@/types/address";

// helpers
import axios from "axios";

export const mapPlaceToForm = (place: IPlace) => {
  const getComp = (type: string) =>
    place.addressComponents.find((c) => c.types?.includes(type))?.longText ||
    "";

  // 1. Gather all "Small Area" components
  const neighborhood = getComp("neighborhood");
  const subLoc3 = getComp("sublocality_level_3");
  const subLoc2 = getComp("sublocality_level_2");
  const subLoc1 = getComp("sublocality_level_1");

  // 2. Create a "Smart" Address Line 1
  // We prioritize the most specific (neighborhood/level 3) first.
  // Using a Set prevents duplicates (sometimes Google puts the same name in two fields)
  const addressParts = Array.from(
    new Set([neighborhood, subLoc3, subLoc2, subLoc1]),
  ).filter(Boolean);

  const addressLine1 = addressParts.join(", ");

  return {
    place_id: place.id,
    formatted_address: place.formattedAddress,

    // If the combined parts are empty, use the full formatted string as a safe fallback
    area: addressLine1 || place.formattedAddress,

    city: getComp("locality") || getComp("administrative_area_level_3"),
    state: getComp("administrative_area_level_1"),
    pincode: getComp("postal_code"),

    latitude: place.location.latitude,
    longitude: place.location.longitude,
  };
};

export const mapGeocodeToForm = (result: any) => {
  const getComp = (type: string) =>
    result.address_components.find((c: any) => c.types.includes(type))
      ?.long_name || "";

  // 1. Gather all "Small Area" components
  const neighborhood = getComp("neighborhood");
  const subLoc3 = getComp("sublocality_level_3");
  const subLoc2 = getComp("sublocality_level_2");
  const subLoc1 = getComp("sublocality_level_1");

  // 2. Same smart merging logic (your approach preserved)
  const addressParts = Array.from(
    new Set([neighborhood, subLoc3, subLoc2, subLoc1]),
  ).filter(Boolean);

  const addressLine1 = addressParts.join(", ");

  return {
    // ✅ Same keys as your original function
    place_id: result.place_id,
    formatted_address: result.formatted_address,

    area: addressLine1 || result.formatted_address,

    city: getComp("locality") || getComp("administrative_area_level_3"),
    state: getComp("administrative_area_level_1"),
    pincode: getComp("postal_code"),

    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
  };
};

export const getAddressFromCoords = async (
  lat: number,
  lng: number,
): Promise<IPlace> => {
  const { data } = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.NEXT_PUBLIC_GEOCODING_API_KEY,
      },
    },
  );
  return data.results[0]; // most relevant result
};
