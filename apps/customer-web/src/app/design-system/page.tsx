import { type Metadata } from 'next';

import { Gallery } from './gallery';

export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
};

/** A living preview of packages/ui, used to check components by eye, keyboard and screen reader. */
export default function DesignSystemPage() {
  return (
    <main id="main" className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Design system</h1>
        <p className="text-muted-foreground">
          FareRide components from packages/ui. Switch the theme to check both palettes.
        </p>
      </header>
      <Gallery />
    </main>
  );
}
