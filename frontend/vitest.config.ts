import { resolve } from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use Node environment (not jsdom) for utility tests
    // Switch to 'jsdom' if you add component tests later
    environment: 'node',
    // Include test files matching these patterns
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    // Code coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['utils/**', 'hooks/**', 'app/**'],
      exclude: ['**/__tests__/**', '**/*.test.{ts,tsx}', 'sanity.types.ts'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
