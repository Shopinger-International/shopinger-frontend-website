// types
import type { FC } from "react";
import type { ICoords } from "../manage-address/add-address-modal/add-address-modal.component";

// react
import { useState } from "react";

// external component
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

type IProps = {
  zoom: number;
  updateZoom: (zoom: number) => void;
  position: ICoords;
  onChange: (coords: ICoords) => void;
};

const LocationPicker: FC<IProps> = ({
  zoom,
  updateZoom,
  position,
  onChange,
}) => {
  const [loadingLocation, setLoadingLocation] = useState(false);

  if (!process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY) {
    throw new Error("Missing Google Maps API key");
  }

  // 📍 Get current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        onChange({ lat, lng }); // move marker
        updateZoom(15); // zoom in nicely

        setLoadingLocation(false);
      },
      (error) => {
        setLoadingLocation(false);

        if (error.code === error.PERMISSION_DENIED) {
          alert("Location permission denied");
        } else {
          alert("Unable to fetch location");
        }

        console.error(error);
      },
    );
  };

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY}
      libraries={["places"]}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg border border-gray-300">
        {/* 📍 Current Location Button */}
        <button
          onClick={handleCurrentLocation}
          disabled={loadingLocation}
          className="absolute top-3 right-3 z-10 rounded-md bg-white px-3 py-2 text-sm shadow-md hover:bg-gray-100 disabled:opacity-50"
        >
          {loadingLocation ? "Locating..." : "📍 Current Location"}
        </button>

        <Map
          defaultZoom={zoom}
          center={position}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
          gestureHandling="greedy"
        >
          <AdvancedMarker
            draggable
            position={position}
            onDragEnd={(e) => {
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();

              if (lat && lng) {
                onChange({ lat, lng });
              }
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
      </div>
    </APIProvider>
  );
};

export default LocationPicker;
