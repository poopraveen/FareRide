# 0011. An owned component library on Radix primitives

- Status: Accepted
- Date: 2026-10-02

## Context

The three web apps need one look, one set of accessible components and light and dark themes. The brief names shadcn/ui, which is not a dependency but a way of copying component source into the project. The components must meet WCAG 2.2 AA, and the apps are only consumed by Next.js.

## Decision

- `packages/ui` holds the components as our own source, in the shadcn style: Radix primitives (through the `radix-ui` package) for behaviour such as focus trapping and keyboard support, Tailwind CSS v4 for styling, `class-variance-authority` for variants and `tailwind-merge` for overrides.
- Colours are semantic CSS custom properties (`--fr-primary`, `--fr-danger-soft`) declared once in `src/styles.css` and mapped to Tailwind colour names with `@theme inline`. Components never name a hue.
- Light is the default theme. Dark applies when the OS prefers it, unless the page sets `data-theme="light"`; `data-theme="dark"` forces it.
- The package ships TypeScript source and is compiled by each Next.js app through `transpilePackages`, unlike the server packages in ADR 0010, which compile to `dist/`. It resolves modules the bundler way, so its relative imports have no `.js` extension.
- Each component has tests for axe rules and keyboard behaviour in jsdom, and a test computes the WCAG contrast of every token pair in both themes, because jsdom cannot check contrast.

## Consequences

- We own and can change every component; there is no upstream library version to track except Radix.
- Changing a token updates every app at once, and a change that breaks contrast fails CI.
- `eslint-plugin-jsx-a11y` does not support ESLint 10 yet, so accessibility linting relies on the axe tests until it does.
