import reactHooks from 'eslint-plugin-react-hooks';

import { base } from './base.js';

/**
 * Rules for React libraries that are not Next.js apps, such as packages/ui.
 *
 * @param {{ tsconfigRootDir: string }} options
 */
export function react(options) {
  return [
    ...base(options),
    {
      plugins: { 'react-hooks': reactHooks },
      rules: reactHooks.configs.recommended.rules,
    },
  ];
}
