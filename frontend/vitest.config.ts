import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    // Enable globals like describe, it, expect
    globals: true,
    // Use jsdom environment for component tests
    environment: 'jsdom',
    // Include test files matching these patterns
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    // Setup file for RTL matchers
    setupFiles: ['./vitest.setup.ts'],
    // Code coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['utils/**', 'hooks/**', 'app/**', 'ui/**'],
      exclude: ['**/__tests__/**', '**/*.test.{ts,tsx}', 'sanity.types.ts'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
