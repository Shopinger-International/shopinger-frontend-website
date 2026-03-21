// https://developers.google.com/maps/documentation/javascript/examples/rgm-autocomplete#maps_rgm_autocomplete-typescript
import { useState, useEffect } from "react";

// types
import type { FC } from "react";

// external component

import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

// local components
import PlaceAutocomplete from "@/components/common/location-picker/place-autocomplete.component";

// const
const API_KEY = process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY!;
const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;

type IChord = {
  lat: number;
  lng: number;
};

type IProps = {
  position: IChord;
  updatePosition: (zoom: IChord) => void;
};

const LocationPicker: FC<IProps> = ({ position, updatePosition }) => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Map
        mapId={MAP_ID}
        defaultZoom={12}
        defaultCenter={position}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {/* <AdvancedMarker
          ref={markerRef}
          position={position}
          onDragEnd={(e) => {
            let lng = e.latLng?.lng();
            let lat = e.latLng?.lat();
            lng &&
              lat &&
              updatePosition({
                lat,
                lng,
              });
          }}
        /> */}

        <AdvancedMarker
          ref={markerRef}
          draggable
          position={position}
          onDragEnd={(e) => {
            let lng = e.latLng?.lng();
            let lat = e.latLng?.lat();
            lng &&
              lat &&
              updatePosition({
                lat,
                lng,
              });
          }}
        >
          {/* Custom Marker UI */}
          <div className="relative flex items-center justify-center">
            {/* Pulse ring */}
            <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-orange-400 opacity-75"></span>

            {/* Inner circle */}
            <span className="relative inline-flex h-6 w-6 rounded-full border-2 border-white bg-orange-600 shadow-lg"></span>
          </div>
        </AdvancedMarker>
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
        </div>
      </MapControl>
      <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
};
export default LocationPicker;

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

const MapHandler = ({ place, marker }: MapHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};
