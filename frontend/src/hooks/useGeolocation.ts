import { useState, useEffect, useCallback } from 'react';
import type { GpsCoordinates } from '../types';

export const DEFAULT_FACILITY_GPS: GpsCoordinates = {
  latitude: 17.4325,
  longitude: 78.1254,
  accuracy: 4,
  altitude: 532,
  locationName: 'Primary Care Center - Shankarpally Clinic',
  timestamp: new Date().toISOString(),
};

export function useGeolocation() {
  const [location, setLocation] = useState<GpsCoordinates>(DEFAULT_FACILITY_GPS);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: GpsCoordinates = {
          latitude: parseFloat(pos.coords.latitude.toFixed(5)),
          longitude: parseFloat(pos.coords.longitude.toFixed(5)),
          accuracy: pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 5,
          altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : 520,
          heading: pos.coords.heading ?? undefined,
          speed: pos.coords.speed ?? undefined,
          locationName: 'Live GPS Position (Field Node)',
          timestamp: new Date(pos.timestamp).toISOString(),
        };

        setLocation(coords);
        setIsLocating(false);
        setPermissionGranted(true);
      },
      (err) => {
        console.warn('Geolocation warning:', err.message);
        setError(err.message || 'Unable to retrieve GPS coordinates.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Try fetching on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      detectLocation();
    }
  }, [detectLocation]);

  return {
    location,
    setLocation,
    isLocating,
    error,
    permissionGranted,
    detectLocation,
  };
}

// Distance helper using Haversine formula
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}
