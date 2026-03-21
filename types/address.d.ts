export interface IAddressComponent {
  longText: string;
  shortText: string;
  types: string[]; // These are strings like 'postal_code', 'country', etc.
  languageCode: string;
}

export interface IPlace {
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  addressComponents: IAddressComponent[];
}
