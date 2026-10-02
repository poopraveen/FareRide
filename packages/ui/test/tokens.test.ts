import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { contrastRatio } from './contrast';

const css = readFileSync(resolve(import.meta.dirname, '../src/styles.css'), 'utf8');

/** Reads the --fr-* custom properties declared directly inside the block that starts at `selector`. */
function tokensIn(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`Selector not found: ${selector}`);
  const end = css.indexOf('}', start);
  const block = css.slice(start, end);
  return Object.fromEntries(
    [...block.matchAll(/--fr-([\w-]+):\s*([^;]+);/g)].map((m) => [m[1] ?? '', m[2] ?? '']),
  );
}

const themes = {
  light: tokensIn(':root'),
  dark: tokensIn(":root[data-theme='dark']"),
};

/** Text pairs need 4.5:1 (WCAG 1.4.3); control boundaries and focus rings need 3:1 (1.4.11). */
const textPairs: [foreground: string, background: string][] = [
  ['foreground', 'background'],
  ['foreground', 'surface'],
  ['foreground', 'surface-muted'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'surface'],
  ['muted-foreground', 'surface-muted'],
  ['primary-foreground', 'primary'],
  ['primary-foreground', 'primary-hover'],
  ['secondary-foreground', 'secondary'],
  ['secondary-foreground', 'secondary-hover'],
  ['danger-foreground', 'danger'],
  ['danger-foreground', 'danger-hover'],
  ['info-strong', 'info-soft'],
  ['success-strong', 'success-soft'],
  ['warning-strong', 'warning-soft'],
  ['danger-strong', 'danger-soft'],
  ['danger-strong', 'background'],
  ['danger-strong', 'surface'],
  ['primary', 'surface'],
];

const nonTextPairs: [element: string, background: string][] = [
  ['input', 'background'],
  ['input', 'surface'],
  ['ring', 'background'],
  ['ring', 'surface'],
  ['primary', 'background'],
];

describe.each(Object.entries(themes))('%s theme', (_name, tokens) => {
  const get = (token: string) => {
    const value = tokens[token];
    if (value === undefined) throw new Error(`Missing token --fr-${token}`);
    return value;
  };

  it.each(textPairs)('%s on %s meets 4.5:1 for text', (foreground, background) => {
    expect(contrastRatio(get(foreground), get(background))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(nonTextPairs)('%s against %s meets 3:1 for controls', (element, background) => {
    expect(contrastRatio(get(element), get(background))).toBeGreaterThanOrEqual(3);
  });
});

describe('theme definitions', () => {
  it('declares the same tokens in both themes', () => {
    expect(Object.keys(themes.dark).sort()).toEqual(Object.keys(themes.light).sort());
  });

  it('uses identical values for system dark and forced dark', () => {
    expect(tokensIn(":root:not([data-theme='light'])")).toEqual(themes.dark);
  });
});
