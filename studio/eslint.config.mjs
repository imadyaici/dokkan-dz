import studioConfig from '@sanity/eslint-config-studio';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // Global ignores
  {
    ignores: ['node_modules/**', 'dist/**', '.sanity/**', 'schema.json'],
  },

  // Sanity studio config (already flat config in v5+)
  ...studioConfig,

  // Prettier must be last
  prettierConfig,
];

export default config;
