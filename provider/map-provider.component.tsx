// types
import type { FC, ReactNode } from "react";

// external component
import { APIProvider, Map } from "@vis.gl/react-google-maps";

// const
const API_KEY = process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API_KEY!;
const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;
const INDIA_BOUNDS = {
  north: 35.51,
  south: 6.46,
  west: 68.12,
  east: 97.41,
};

type IProps = {
  children: ReactNode;
  min_zoom:number;
  max_zoom:number;
};

const MapProvider: FC<IProps> = ({ children, min_zoom,max_zoom }) => {
  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Map
        mapId={MAP_ID}
        defaultZoom={16}
        defaultCenter={{
          lat: 28.6139,
          lng: 77.209,
        }}
        minZoom={min_zoom}
        maxZoom={max_zoom}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        restriction={{
          latLngBounds: INDIA_BOUNDS,
          strictBounds: false, // set to true to hard-stop the camera at the borders
        }}
      >
        {children}
      </Map>
    </APIProvider>
  );
};

export default MapProvider;
