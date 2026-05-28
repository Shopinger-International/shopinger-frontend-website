import { useEffect } from "react";

import type IChord from "@/types/chord";

// hooks
import { useMap } from "@vis.gl/react-google-maps";

const MapUpdater = ({ position }: { position: IChord }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo(position); // smooth animation
    }
  }, [position, map]);

  return null;
};

export default MapUpdater;