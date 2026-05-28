import { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import type IChord from "@/types/chord";

type DirectionsProps = {
  start: IChord;
  end: IChord;
};

const Directions = ({ start, end }: DirectionsProps) => {
  const map = useMap();
  const routes_library = useMapsLibrary("routes");

  const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);

  useEffect(() => {
    return () => {
      polylines.forEach((p) => p.setMap(null));
    };
  }, [polylines]);

  useEffect(() => {
    if (!routes_library || !map || !start.lat || !end.lat) return;

    const fetchRoute = async () => {
      try {
        const request: google.maps.routes.ComputeRoutesRequest = {
          origin: { lat: start.lat, lng: start.lng! },
          destination: { lat: end.lat, lng: end.lng! },
          travelMode: "DRIVING",
          fields: ["path", "legs"],
        };

        const response = await routes_library.Route.computeRoutes(request);

        if (response.routes && response.routes.length > 0) {
          const targetRoute = response.routes[0];

          // 1. Generate the standard Google Maps polyline array
          const generatedPolylines = targetRoute.createPolylines();

          // 2. Explicitly bind each polyline segment to your active map canvas
          generatedPolylines.forEach((polyline) => {
            polyline.setMap(map);
          });

          // 3. Save the active instances to local component state
          setPolylines(generatedPolylines);
        }
      } catch (error) {
        console.error("Error computing routes via modern Routes API:", error);
      }
    };

    fetchRoute();
  }, [routes_library, map, start, end]);

  // Renders nothing to the DOM directly; the Google Maps engine handles the drawing layout
  return null;
};

export default Directions;
