import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';

const alertVariants = cva('flex flex-col gap-1 rounded-md border-l-4 p-4 text-sm', {
  variants: {
    tone: {
      info: 'border-info-strong bg-info-soft text-info-strong',
      success: 'border-success-strong bg-success-soft text-success-strong',
      warning: 'border-warning-strong bg-warning-soft text-warning-strong',
      danger: 'border-danger-strong bg-danger-soft text-danger-strong',
    },
  },
  defaultVariants: { tone: 'info' },
});

export interface AlertProps
  extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof alertVariants> {
  title?: ReactNode;
}

/**
 * An inline message. Danger alerts interrupt screen readers (role="alert");
 * the other tones are announced politely (role="status").
 */
export function Alert({ className, tone, title, children, ...props }: AlertProps) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      {children ? <div>{children}</div> : null}
    </div>
  );
}
