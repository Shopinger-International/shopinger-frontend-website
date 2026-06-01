// types
import type { FC } from "react";
import type ICoord from "@/types/coord";

// local components
import CustomMarker from "@/components/common/map/map-route/custom-marker.component";
import Directions from "@/components/common/map/map-route/directions.component";
import MapViewportBounds from "@/components/common/map/map-route/map-viewport-bounds.component";
import MapProvider from "@/provider/map-provider.component";

// external components
import { AdvancedMarker } from "@vis.gl/react-google-maps";

// hooks

type IProps = {
  start_chords: ICoord;
  end_chords: ICoord;
  updatePosition: (zoom: ICoord) => void;
};

const RouteMap: FC<IProps> = ({ start_chords, end_chords }) => {
  return (
    <MapProvider min_zoom={12} max_zoom={18}>
      <MapViewportBounds start={start_chords} end={end_chords} />
      <AdvancedMarker position={start_chords}>
        <CustomMarker type="start" />
      </AdvancedMarker>
      <AdvancedMarker position={end_chords}>
        <CustomMarker type="end" />
      </AdvancedMarker>
      <Directions start={start_chords} end={end_chords} />
    </MapProvider>
  );
};

export default RouteMap;
