'use client';

import { Dialog as DialogPrimitive } from 'radix-ui';
import { type ComponentProps } from 'react';

import { cn } from '../lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  /** Accessible name of the corner close button. */
  closeLabel?: string;
}

/**
 * A modal dialog. Focus moves into it, stays inside while open, Escape closes
 * it and focus returns to the trigger. Always include a <DialogTitle>.
 */
export function DialogContent({
  className,
  children,
  closeLabel = 'Close',
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 animate-fade-in bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 animate-scale-in flex-col gap-4 overflow-y-auto rounded-lg bg-surface p-6 text-foreground shadow-overlay',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="absolute top-3 right-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5 pr-10', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg leading-tight font-semibold', className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-3 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}
