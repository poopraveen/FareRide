import { type ComponentProps } from 'react';

import { cn } from '../lib/cn';

/** A loading placeholder. Hidden from assistive technology; pair it with an announced loading state. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-md bg-surface-muted motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
}
