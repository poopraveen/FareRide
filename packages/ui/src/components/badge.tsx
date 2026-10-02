import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps } from 'react';

import { cn } from '../lib/cn';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-muted text-foreground',
        info: 'bg-info-soft text-info-strong',
        success: 'bg-success-soft text-success-strong',
        warning: 'bg-warning-soft text-warning-strong',
        danger: 'bg-danger-soft text-danger-strong',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

/** Status text. Colour is never the only signal, so the label must say the status. */
export function Badge({
  className,
  tone,
  ...props
}: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
