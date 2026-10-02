import './globals.css';

import { type Metadata, type Viewport } from 'next';
import { type ReactNode } from 'react';

export const metadata: Metadata = {
  title: { default: 'FareRide', template: '%s · FareRide' },
  description: 'Rides, food and parcels',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#14161c' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-ink min-h-dvh antialiased">{children}</body>
    </html>
  );
}
