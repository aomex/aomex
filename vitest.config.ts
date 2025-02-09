import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: ['packages/*'],
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['packages/**/src/**'],
      exclude: ['packages/console/bin.mjs'],
      all: true,
      // lines: 99,
      // functions: 99,
      // branches: 99,
      // statements: 99,
      reporter: ['html', 'lcovonly', 'text-summary'],
    },
    maxConcurrency: 1,
    fileParallelism: false,
    logHeapUsage: true,
    environment: 'node',
    retry: 1,
    globals: true,
    snapshotFormat: {
      escapeString: false,
      printBasicPrototype: false,
    },
    globalSetup: 'vitest.setup.ts',
    watch: false,
  },
});
