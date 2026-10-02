import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';

import { base } from './base.js';

/** @param {{ tsconfigRootDir: string }} options */
export function next(options) {
  return [
    ...base(options),
    {
      plugins: { '@next/next': nextPlugin, 'react-hooks': reactHooks },
      rules: {
        ...nextPlugin.configs.recommended.rules,
        ...nextPlugin.configs['core-web-vitals'].rules,
        ...reactHooks.configs.recommended.rules,
      },
    },
  ];
}
