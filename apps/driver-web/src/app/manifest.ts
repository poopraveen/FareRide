import { type MetadataRoute } from 'next';

// Web app manifest for installability. Icons and the service worker arrive with the design system (Phase 3) and PWA work (Phase 5).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FareRide Driver',
    short_name: 'FareRide Driver',
    description: 'Drive and deliver with FareRide',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fbf9',
    theme_color: '#f8fbf9',
  };
}
