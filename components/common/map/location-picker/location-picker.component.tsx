// types
import type { FC } from "react";
import type ICoord from "@/types/coord";

// local components
import MapProvider from "@/provider/map-provider.component";
import MapUpdater from "@/components/common/map/map-updater.component";

// external component
import { AdvancedMarker } from "@vis.gl/react-google-maps";

type INullableChord = {
  [K in keyof ICoord]: ICoord[K] | null;
};

type IProps = {
  position: INullableChord;
  updatePosition: (zoom: ICoord) => void;
};
const LocationPicker: FC<IProps> = ({ position, updatePosition }) => {
  return (
    <MapProvider min_zoom={0} max_zoom={21}>
      {position.lat && position.lng && (
        <>
          <MapUpdater position={position as ICoord} />
          <AdvancedMarker
            draggable
            position={position as ICoord}
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
        </>
      )}
    </MapProvider>
  );
};
export default LocationPicker;
