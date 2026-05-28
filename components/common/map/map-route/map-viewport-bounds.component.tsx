import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import type IChord from "@/types/chord";

type ViewportProps = {
  start: IChord;
  end: IChord;
};

const MapViewportBounds = ({ start, end }: ViewportProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start.lat || !start.lng || !end.lat || !end.lng) return;

    // 1. Create a native Google Maps coordinate bounds container
    const bounds = new google.maps.LatLngBounds();

    // 2. Extend the container box to include both coordinates
    bounds.extend({ lat: start.lat, lng: start.lng });
    bounds.extend({ lat: end.lat, lng: end.lng });

    // 3. Command the map engine to fit the bounds smoothly with padding (in pixels)
    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    });
  }, [map, start.lat, start.lng, end.lat, end.lng]);

  return null; // Side-effect runner, no rendering overhead
};

export default MapViewportBounds;
