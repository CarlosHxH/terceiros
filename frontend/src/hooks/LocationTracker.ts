import { useState, useEffect } from 'react';

const LocationTracker = ():{ coords: GeolocationCoordinates | null, error: string | null } => {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords(position.coords)
        },
        (err) => {
          setError(err.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);
  
  return { coords, error };
}

export default LocationTracker;