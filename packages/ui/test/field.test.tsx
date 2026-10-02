import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Field, Input, Switch, Textarea } from '../src';
import { expectNoAxeViolations } from './axe';

describe('Field', () => {
  it('labels the control and describes it with the hint', async () => {
    render(
      <Field label="Phone number" hint="We send a one-time code by SMS">
        <Input type="tel" autoComplete="tel" />
      </Field>,
    );

    const input = screen.getByRole('textbox', { name: 'Phone number' });
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(accessibleDescription(input)).toBe('We send a one-time code by SMS');
    await expectNoAxeViolations();
  });

  it('marks the control invalid and describes it with the error', async () => {
    render(
      <Field
        label="Phone number"
        hint="Include the country code"
        error="Enter a valid phone number"
        required
      >
        <Input type="tel" />
      </Field>,
    );

    const input = screen.getByRole('textbox', { name: /Phone number/ });
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(accessibleDescription(input)).toBe(
      'Include the country code Enter a valid phone number',
    );
    await expectNoAxeViolations();
  });

  it('focuses the control when the label is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Field label="Notes for the driver">
        <Textarea />
      </Field>,
    );

    await user.click(screen.getByText('Notes for the driver'));
    expect(document.activeElement).toBe(
      screen.getByRole('textbox', { name: 'Notes for the driver' }),
    );
  });

  it('labels a switch, which toggles with Space', async () => {
    const user = userEvent.setup();
    render(
      <Field label="Go online">
        <Switch />
      </Field>,
    );

    const toggle = screen.getByRole('switch', { name: 'Go online' });
    expect(toggle.getAttribute('aria-checked')).toBe('false');

    await user.tab();
    expect(document.activeElement).toBe(toggle);
    await user.keyboard(' ');
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    await expectNoAxeViolations();
  });
});

function accessibleDescription(element: HTMLElement): string {
  return (element.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ');
}
