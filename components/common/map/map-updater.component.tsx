import { useEffect } from "react";

import type ICoord from "@/types/coord";

// hooks
import { useMap } from "@vis.gl/react-google-maps";

const MapUpdater = ({ position }: { position: ICoord }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo(position); // smooth animation
    }
  }, [position, map]);

  return null;
};

export default MapUpdater;