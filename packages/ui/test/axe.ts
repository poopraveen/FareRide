import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe-core against the rendered DOM and fails with a readable list of violations.
 * Colour contrast cannot be computed in jsdom; tokens.test.ts covers it instead.
 * The landmark rule is page-level, so it is off for components rendered on their own.
 */
export async function expectNoAxeViolations(container: Element = document.body): Promise<void> {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  const summary = results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.help}\n  ${violation.nodes.map((node) => node.html).join('\n  ')}`,
  );
  expect(summary).toEqual([]);
}
