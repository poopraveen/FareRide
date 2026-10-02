import { type ComponentProps } from 'react';

import { cn } from '../lib/cn';

export interface SpinnerProps extends ComponentProps<'span'> {
  /** Announced to screen readers. Pass null when the spinner sits inside a control that already says it is busy. */
  label?: string | null;
}

export function Spinner({ label = 'Loading', className, ...props }: SpinnerProps) {
  return (
    <span
      role={label === null ? undefined : 'status'}
      className={cn('inline-flex items-center', className)}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="size-[1em] animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {label === null ? null : <span className="sr-only">{label}</span>}
    </span>
  );
}
