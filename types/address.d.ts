export interface IAddressComponent {
  longText: string;
  shortText: string;
  types: string[]; // These are strings like 'postal_code', 'country', etc.
  languageCode: string;
}

export interface IPlace {
  id: string;
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  addressComponents: IAddressComponent[];
}

export interface IAddress {
  id: number;
  user_id: number;

  // Contact info (can differ from user profile)
  full_name: string;
  phone: string;

  // Address breakdown
  house_number: string;
  street: string;
  address1: string;
  landmark: string;

  city: string;
  state: string;
  zip: string;
  country: "India";

  // Google data
  place_id: string;
  formatted_address: string;

  // Geo
  latitude: number;
  longitude: number;

  // Type & labeling
  address_type: "home" | "work" | "other";

  // Delivery help
  delivery_instructions?: string;

  // User preference
  is_default: boolean;

  // Lifecycle
  is_deleted: boolean;
}
