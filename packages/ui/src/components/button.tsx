'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { type ComponentProps, type MouseEvent } from 'react';

import { cn } from '../lib/cn';
import { Spinner } from './spinner';

export const buttonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none',
    'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        outline: 'border border-input bg-surface text-foreground hover:bg-surface-muted',
        ghost: 'text-foreground hover:bg-surface-muted',
        danger: 'bg-danger text-danger-foreground hover:bg-danger-hover',
      },
      // md and lg meet the 44px touch target used across the mobile apps; sm still clears WCAG 2.5.8 (24px).
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        icon: 'size-11',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** Render the single child (for example a link) with button styles instead of a <button>. */
  asChild?: boolean;
  /** Shows a spinner and blocks activation while keeping the button focusable and its label readable. */
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  loading = false,
  type,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  // aria-disabled rather than disabled while loading, so focus is not lost mid-submit.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type ?? 'button'}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...props}
    >
      {loading ? <Spinner label={null} /> : null}
      {children}
    </button>
  );
}
