// https://developers.google.com/maps/documentation/javascript/examples/rgm-autocomplete#maps_rgm_autocomplete-typescript
// types
import { useEffect, type FC } from "react";

// external component
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";

// hooks
import { useMap } from "@vis.gl/react-google-maps";

// const
const API_KEY = process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY!;
const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;
const INDIA_BOUNDS = {
  north: 35.51,
  south: 6.46,
  west: 68.12,
  east: 97.41,
};

type IChord = {
  lat: number;
  lng: number;
};

type IProps = {
  position: IChord;
  updatePosition: (zoom: IChord) => void;
};

const LocationPicker: FC<IProps> = ({ position, updatePosition }) => {
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
        restriction={{
          latLngBounds: INDIA_BOUNDS,
          strictBounds: false, // set to true to hard-stop the camera at the borders
        }}
      >
        <MapUpdater position={position} />
        <AdvancedMarker
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
    </APIProvider>
  );
};
export default LocationPicker;

const MapUpdater = ({ position }: { position: IChord }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo(position); // smooth animation
    }
  }, [position, map]);

  return null;
};
