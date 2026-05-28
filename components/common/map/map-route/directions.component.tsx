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
          const target_route = response.routes[0];

          // LAYER 1: The Shadow/Casing Layer (Thicker & Deep Rust Orange)
          const border_polylines = target_route.createPolylines({
            polylineOptions: {
              strokeColor: "#ffffff", // Dark Rust Orange (Tailwind orange-900)
              strokeOpacity: 1, // Soft transparent outline shadow
              strokeWeight: 10, // Extra wide to peek cleanly out from behind
              geodesic: true,
              zIndex: 1, // Anchor directly below the core vector line
            },
          });

          // LAYER 2: The Core Active Route (Thinner & Vibrant Orange 500)
          const core_polylines = target_route.createPolylines({
            polylineOptions: {
              strokeColor: "#f97316", // Vibrant Orange (Tailwind orange-500)
              strokeOpacity: 1, // Sharp, solid color visibility
              strokeWeight: 5, // Compact thickness to sit dead-center
              geodesic: true,
              zIndex: 2, // Force layer stack directly on top
            },
          });

          // Render both generated arrays to the active map canvas context
          border_polylines.forEach((p) => p.setMap(map));
          core_polylines.forEach((p) => p.setMap(map));

          // Combine both sets of instances into state for flawless unmount cleanups
          setPolylines([...border_polylines, ...core_polylines]);
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
