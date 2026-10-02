'use client';

import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Skeleton,
  Spinner,
  Switch,
  Textarea,
} from '@fareride/ui';
import { type ReactNode, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';

export function Gallery() {
  const [theme, setTheme] = useState<Theme>('system');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const applyTheme = (next: Theme) => {
    setTheme(next);
    const root = document.documentElement;
    if (next === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', next);
  };

  const phoneError =
    submitted && !/^\+?[\d\s-]{7,}$/.test(phone) ? 'Enter a valid phone number' : undefined;

  return (
    <>
      <Section title="Theme">
        <div role="group" aria-label="Theme" className="flex flex-wrap gap-2">
          {(['system', 'light', 'dark'] as const).map((option) => (
            <Button
              key={option}
              size="sm"
              variant={theme === option ? 'primary' : 'outline'}
              aria-pressed={theme === option}
              onClick={() => {
                applyTheme(option);
              }}
            >
              {option[0]?.toUpperCase()}
              {option.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Book ride</Button>
          <Button variant="secondary">Schedule</Button>
          <Button variant="outline">Add stop</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="danger">Cancel ride</Button>
          <Button disabled>Unavailable</Button>
          <Button
            loading={saving}
            onClick={() => {
              setSaving(true);
              window.setTimeout(() => {
                setSaving(false);
              }, 1500);
            }}
          >
            Save
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Form fields">
        <form
          noValidate
          className="flex max-w-sm flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <Field
            label="Phone number"
            hint="We send a one-time code by SMS"
            error={phoneError}
            required
          >
            <Input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
              }}
            />
          </Field>
          <Field label="Notes for the driver">
            <Textarea placeholder="Gate code, landmarks" />
          </Field>
          <Field label="Share trip status with contacts">
            <Switch />
          </Field>
          <Button type="submit">Continue</Button>
        </form>
      </Section>

      <Section title="Status">
        <div className="flex flex-wrap gap-2">
          <Badge>Scheduled</Badge>
          <Badge tone="info">Searching</Badge>
          <Badge tone="success">Completed</Badge>
          <Badge tone="warning">Delayed</Badge>
          <Badge tone="danger">Cancelled</Badge>
        </div>
        <div className="flex flex-col gap-3">
          <Alert tone="info" title="Price may change">
            Fares update with traffic until you confirm.
          </Alert>
          <Alert tone="success" title="Payment received" />
          <Alert tone="warning" title="Heavy traffic">
            Your trip may take longer than usual.
          </Alert>
          <Alert tone="danger" title="Payment failed">
            Try another card or pay with cash.
          </Alert>
        </div>
      </Section>

      <Section title="Cards and loading">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Economy</CardTitle>
              <CardDescription>Affordable everyday rides, up to 4 seats</CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">$12.40</CardContent>
            <CardFooter>
              <Button fullWidth>Choose Economy</Button>
            </CardFooter>
          </Card>
          <Card aria-busy="true">
            <CardHeader>
              <CardTitle>Finding prices</CardTitle>
              <CardDescription>
                <Spinner label="Loading prices" />
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-11 w-full" />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Dialog">
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
              <DialogClose asChild>
                <Button variant="danger">Cancel ride</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby={sectionId(title)}>
      <h2 id={sectionId(title)} className="text-xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

function sectionId(title: string): string {
  return `section-${title.toLowerCase().replace(/\W+/g, '-')}`;
}
