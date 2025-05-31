import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Declaración de tipos para Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleMapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    position: {
      lat: number;
      lng: number;
    };
    title?: string;
  }>;
  style?: React.CSSProperties;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 4.6097, lng: -74.0817 }, // Default to Bogotá
  zoom = 13,
  markers = [],
  style = { width: '100%', height: '400px' },
  onMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places'], // Agregamos la librería de places
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current && !mapInstanceRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          });

          mapInstanceRef.current = map;

          // Add markers if provided
          markers.forEach((marker) => {
            new google.maps.Marker({
              position: marker.position,
              map,
              title: marker.title,
            });
          });

          // Add click listener if provided
          if (onMapClick) {
            map.addListener('click', onMapClick);
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [center, zoom, markers, onMapClick]);

  return <div ref={mapRef} style={style} />;
};

export default GoogleMap;
