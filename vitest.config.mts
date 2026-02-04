import { defineConfig } from 'vitest/config';

// Vitest configuration for devkit-cli.
// We enable globals so tests can use describe/it/expect without importing from 'vitest',
// which keeps test files simple and friendly for CommonJS-style modules.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Use forks so process.chdir() works (not allowed in thread workers)
    pool: 'forks',
  },
});

