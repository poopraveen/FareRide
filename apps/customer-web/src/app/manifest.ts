import { type MetadataRoute } from 'next';

// Web app manifest for installability. Icons and the service worker arrive with the design system (Phase 3) and PWA work (Phase 5).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FareRide',
    short_name: 'FareRide',
    description: 'Rides, food and parcels',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fbf9',
    theme_color: '#f8fbf9',
  };
}
