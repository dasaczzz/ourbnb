import React, { useState } from 'react';
import GoogleMap from './GoogleMap';

interface LocationPickerProps {
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation = { lat: 4.6097, lng: -74.0817 } // Default to Bogotá
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation
  );

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newLocation = { lat, lng };
      setSelectedLocation(newLocation);
      onLocationSelect?.(newLocation);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Selecciona una ubicación</h3>
        {selectedLocation && (
          <p className="text-sm text-gray-600">
            Coordenadas seleccionadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        )}
      </div>
      
      <div className="rounded-lg overflow-hidden shadow-lg">
        <GoogleMap
          center={selectedLocation || initialLocation}
          zoom={13}
          markers={
            selectedLocation
              ? [
                  {
                    position: selectedLocation,
                    title: "Ubicación seleccionada",
                  },
                ]
              : []
          }
          onMapClick={handleMapClick}
          style={{ width: '100%', height: '400px' }}
        />
      </div>
    </div>
  );
};

export default LocationPicker; 