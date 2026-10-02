import { type ComponentProps } from 'react';

import { cn } from '../lib/cn';

const controlClasses = [
  'w-full rounded-md border border-input bg-surface px-3 text-base text-foreground',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
  'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-70',
  'aria-invalid:border-danger-strong aria-invalid:outline-danger-strong',
];

export function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input type={type ?? 'text'} className={cn(controlClasses, 'h-11', className)} {...props} />
  );
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(controlClasses, 'min-h-24 py-2', className)} {...props} />;
}
