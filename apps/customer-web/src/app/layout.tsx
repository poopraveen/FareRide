import './globals.css';

import { type Metadata, type Viewport } from 'next';
import { SkipLink } from '@fareride/ui';
import { type ReactNode } from 'react';

export const metadata: Metadata = {
  title: { default: 'FareRide', template: '%s · FareRide' },
  description: 'Rides, food and parcels',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fbf9' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1016' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
