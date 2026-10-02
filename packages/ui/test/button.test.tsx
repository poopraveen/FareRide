import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../src';
import { expectNoAxeViolations } from './axe';

describe('Button', () => {
  it('has no axe violations in each variant', async () => {
    render(
      <div>
        {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
        <Button size="icon" aria-label="Close">
          ×
        </Button>
        <Button loading>Saving</Button>
      </div>,
    );
    await expectNoAxeViolations();
  });

  it('activates with Enter and Space and defaults to type="button"', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Book ride</Button>);

    const button = screen.getByRole('button', { name: 'Book ride' });
    expect(button).toHaveProperty('type', 'button');

    await user.tab();
    expect(document.activeElement).toBe(button);
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('stays focusable but inert while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => {
      event.preventDefault();
    });
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading onClick={onClick}>
          Pay
        </Button>
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Pay' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');

    await user.tab();
    expect(document.activeElement).toBe(button);
    await user.keyboard('{Enter}');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('cannot be focused or activated when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Unavailable
      </Button>,
    );

    await user.tab();
    expect(document.activeElement).toBe(document.body);
    await user.click(screen.getByRole('button', { name: 'Unavailable' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a link with button styles through asChild', () => {
    render(
      <Button asChild variant="outline">
        <a href="/rides">Your rides</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Your rides' });
    expect(link.className).toContain('border-input');
    expect(screen.queryByRole('button')).toBeNull();
  });
});
