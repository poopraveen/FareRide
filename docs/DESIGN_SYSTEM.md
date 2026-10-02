# Design system

FareRide's components live in `packages/ui` and are shared by the customer, driver and admin web apps. The decision record is [ADR 0011](adr/0011-owned-component-library.md).

A live preview of every component runs at `/design-system` in the customer app (`pnpm dev`, then http://localhost:3000/design-system). It has a theme switch for checking both palettes.

## Using it in an app

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import '@fareride/ui/styles.css';
```

```tsx
import { Button, Field, Input } from '@fareride/ui';

<Field label="Phone number" hint="We send a one-time code by SMS" error={errors.phone}>
  <Input type="tel" autoComplete="tel" />
</Field>
<Button type="submit" loading={isSubmitting}>Continue</Button>
```

The app also lists `@fareride/ui` in `transpilePackages` in `next.config.ts`, because the package ships TypeScript source.

## Tokens

Colours are named for their job, not their hue. Use the Tailwind names (`bg-primary`, `text-muted-foreground`) in components; the CSS variables behind them (`--fr-*`) change with the theme.

| Token                                                                | Use                                                         |
| -------------------------------------------------------------------- | ----------------------------------------------------------- |
| `background`, `foreground`                                           | Page background and body text                               |
| `surface`, `surface-muted`                                           | Cards, inputs and dialogs; subtle fills and hover states    |
| `muted-foreground`                                                   | Secondary text such as hints and descriptions               |
| `border`                                                             | Decorative dividers and card edges                          |
| `input`                                                              | Borders of form controls (meets 3:1 against the background) |
| `ring`                                                               | Focus outlines                                              |
| `primary`, `secondary`, `danger` (each with `-hover`, `-foreground`) | Buttons and other actions                                   |
| `info`, `success`, `warning`, `danger` (each `-soft`, `-strong`)     | Status badges and alerts: soft background, strong text      |

Radii are `rounded-sm` to `rounded-xl`; shadows are `shadow-card` and `shadow-overlay`. The font is the system UI stack, so no font files are downloaded.

## Themes

Light is the default. Dark applies when the operating system prefers it, unless the page sets `data-theme="light"` on `<html>`; `data-theme="dark"` forces dark. Use the `dark:` variant for the rare style that tokens do not cover. The user-facing theme setting arrives with the profile screens.

## Components

| Component                                                                                                     | Notes                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                                                                      | Variants `primary`, `secondary`, `outline`, `ghost`, `danger`; sizes `sm`, `md`, `lg`, `icon`. `loading` keeps focus and blocks activation. `asChild` styles a link |
| `Field`                                                                                                       | Wraps one control and wires its label, hint, error, `aria-invalid` and `aria-describedby`                                                                           |
| `Input`, `Textarea`                                                                                           | Show the invalid state from `aria-invalid`                                                                                                                          |
| `Label`                                                                                                       | Used by `Field`; use directly only for custom layouts                                                                                                               |
| `Switch`                                                                                                      | On/off with `role="switch"`; label it with `Field` or `aria-label`                                                                                                  |
| `Dialog`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` | Modal with focus trap, Escape to close and focus return. Always include a `DialogTitle`                                                                             |
| `Card` and its parts                                                                                          | `CardTitle` takes `as` to fit the heading outline                                                                                                                   |
| `Badge`                                                                                                       | Status tones; the text must say the status, since colour alone is not enough                                                                                        |
| `Alert`                                                                                                       | `danger` is announced immediately (`role="alert"`), the other tones politely (`role="status"`)                                                                      |
| `Spinner`, `Skeleton`                                                                                         | Spinner announces its label; skeletons are hidden from screen readers                                                                                               |
| `SkipLink`                                                                                                    | First element in every app layout, pointing at `<main id="main">`                                                                                                   |

New components are added in the phase that first needs them (for example a radio group for service types in Phase 7, toasts with notifications), following the same pattern: Radix for behaviour, tokens for colour, and tests.

## Accessibility checks

| Check                                                                              | Where                                                                                    |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Contrast of every text pair (4.5:1) and control or focus pair (3:1) in both themes | `packages/ui/test/tokens.test.ts`, CI                                                    |
| axe-core rules for each component                                                  | `packages/ui/test/*.test.tsx`, CI                                                        |
| Keyboard: Tab order, Enter and Space, focus trap, Escape, focus return, skip link  | `packages/ui/test/*.test.tsx`, CI                                                        |
| axe in a real browser at 360, 390, 768, 1024, 1440 and 1920 px in both themes      | Run by hand on `/design-system` for this phase; automated with the E2E suite in Phase 13 |

Rules every component follows: a visible focus outline on everything interactive, touch targets of 44 px for `md` controls (never under 24 px), no information carried by colour alone, and motion reduced when the user asks for it.
