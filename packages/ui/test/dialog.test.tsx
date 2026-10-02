import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../src';
import { expectNoAxeViolations } from './axe';

function CancelRideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Cancel ride</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this ride?</DialogTitle>
          <DialogDescription>Your driver is already on the way.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep ride</Button>
          </DialogClose>
          <Button variant="danger">Cancel ride</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('opens from the keyboard, is named by its title and has no axe violations', async () => {
    const user = userEvent.setup();
    render(<CancelRideDialog />);

    await user.tab();
    await user.keyboard('{Enter}');

    const dialog = screen.getByRole('dialog', { name: 'Cancel this ride?' });
    expect(dialog.contains(document.activeElement)).toBe(true);
    await expectNoAxeViolations();
  });

  it('keeps focus inside while open', async () => {
    const user = userEvent.setup();
    render(<CancelRideDialog />);
    await user.click(screen.getByRole('button', { name: 'Cancel ride' }));

    const dialog = screen.getByRole('dialog');
    for (let step = 0; step < 6; step += 1) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<CancelRideDialog />);

    const trigger = screen.getByRole('button', { name: 'Cancel ride' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('has a labelled close button', async () => {
    const user = userEvent.setup();
    render(<CancelRideDialog />);
    await user.click(screen.getByRole('button', { name: 'Cancel ride' }));

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
