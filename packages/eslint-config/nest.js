import { base } from './base.js';

/**
 * NestJS relies on runtime class references for dependency injection,
 * so imports used only as constructor parameter types must stay value imports.
 *
 * @param {{ tsconfigRootDir: string }} options
 */
export function nest(options) {
  return [
    ...base(options),
    {
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
        '@typescript-eslint/parameter-properties': 'off',
      },
    },
  ];
}
