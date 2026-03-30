"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapControllerProps {
  target: [number, number] | null;
}

export default function MapController({ target }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo(target, 10, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [target, map]);

  return null;
}