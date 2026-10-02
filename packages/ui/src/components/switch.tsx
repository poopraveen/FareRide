'use client';

import { Switch as SwitchPrimitive } from 'radix-ui';
import { type ComponentProps } from 'react';

import { cn } from '../lib/cn';

/** An on/off control (role="switch"). Label it with <Field> or aria-label. */
export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'bg-input data-[state=checked]:bg-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-6 rounded-full bg-surface shadow-card transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );
}
