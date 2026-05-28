// types
import type { FC } from "react";
import type IChord from "@/types/chord";

// local components
import CustomMarker from "@/components/common/map/map-route/custom-marker.component";
import Directions from "@/components/common/map/map-route/directions.component";
import MapViewportBounds from "@/components/common/map/map-route/map-viewport-bounds.component";
import MapProvider from "@/provider/map-provider.component";

// external components
import { AdvancedMarker } from "@vis.gl/react-google-maps";

// hooks

type IProps = {
  start_chords: IChord;
  end_chords: IChord;
  updatePosition: (zoom: IChord) => void;
};

const RouteMap: FC<IProps> = ({ start_chords, end_chords }) => {
  return (
    <MapProvider>
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
