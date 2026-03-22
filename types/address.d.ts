export interface IAddressComponent {
  longText: string;
  shortText: string;
  types: string[]; // These are strings like 'postal_code', 'country', etc.
  languageCode: string;
}

export interface IPlace {
  id:string;
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

  label: string; // home, work, other

  place_id: number;
  formatted_address: string;

  latitude: number;
  longitude: number;

  house_number: number;
  floor: number;
  building: number;
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  landmark: string;

  instructions: string;

  contact_name: string;
  contact_number: string;

  is_default: boolean;
}
