'use client';

import { Slot } from 'radix-ui';
import { type ReactElement, type ReactNode, useId } from 'react';

import { cn } from '../lib/cn';
import { Label } from './label';

export interface FieldProps {
  label: ReactNode;
  /** Exactly one form control, such as <Input />. It receives id, aria-describedby, aria-invalid and required. */
  children: ReactElement;
  hint?: ReactNode;
  /** When set, the control is marked invalid and the message is announced. */
  error?: ReactNode;
  required?: boolean;
  className?: string;
}

/**
 * Connects a label, hint and error message to one control, so assistive
 * technology reads them together (WCAG 1.3.1, 3.3.1, 3.3.2).
 */
export function Field({ label, children, hint, error, required = false, className }: FieldProps) {
  const id = useId();
  const controlId = `${id}-control`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const hasError = error !== undefined && error !== null && error !== false && error !== '';
  const describedBy = [hint ? hintId : null, hasError ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={controlId}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger-strong">
            {' '}
            *
          </span>
        ) : null}
      </Label>
      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <Slot.Root
        id={controlId}
        aria-describedby={describedBy || undefined}
        aria-invalid={hasError || undefined}
        aria-required={required || undefined}
      >
        {children}
      </Slot.Root>
      {hasError ? (
        <p id={errorId} className="text-sm font-medium text-danger-strong">
          {error}
        </p>
      ) : null}
    </div>
  );
}
