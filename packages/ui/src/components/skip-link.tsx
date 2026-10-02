import { type ComponentProps } from 'react';

import { cn } from '../lib/cn';

/** First focusable element on every page; jumps keyboard users past the navigation (WCAG 2.4.1). */
export function SkipLink({
  href = '#main',
  children = 'Skip to main content',
  className,
  ...props
}: ComponentProps<'a'>) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-3 focus:text-foreground focus:shadow-overlay',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
