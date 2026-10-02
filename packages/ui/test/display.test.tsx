import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Alert,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
  SkipLink,
  Spinner,
} from '../src';
import { expectNoAxeViolations } from './axe';

describe('display components', () => {
  it('have no axe violations together', async () => {
    render(
      <>
        <SkipLink />
        <main id="main">
          <h1>Trip</h1>
          <Card>
            <CardHeader>
              <CardTitle as="h2">Economy</CardTitle>
              <CardDescription>4 seats</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge tone="success">Driver arriving</Badge>
              <Skeleton className="h-4 w-24" />
              <Spinner />
            </CardContent>
            <CardFooter>
              <Alert tone="warning" title="Heavy traffic">
                Your trip may take longer than usual.
              </Alert>
            </CardFooter>
          </Card>
        </main>
      </>,
    );
    await expectNoAxeViolations();
  });

  it('announces danger alerts assertively and other tones politely', () => {
    render(
      <>
        <Alert tone="danger" title="Payment failed" />
        <Alert tone="success" title="Payment received" />
      </>,
    );

    expect(screen.getByRole('alert').textContent).toBe('Payment failed');
    expect(screen.getByRole('status').textContent).toBe('Payment received');
  });

  it('announces a standalone spinner by its label', () => {
    render(<Spinner label="Finding a driver" />);
    expect(screen.getByRole('status').textContent).toBe('Finding a driver');
  });

  it('puts the skip link first in tab order, pointing at main', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <nav>
          <a href="/rides">Rides</a>
        </nav>
        <main id="main" />
      </>,
    );

    await user.tab();
    const link = screen.getByRole('link', { name: 'Skip to main content' });
    expect(document.activeElement).toBe(link);
    expect(link.getAttribute('href')).toBe('#main');
  });
});
