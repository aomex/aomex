import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  // TC39 decorators：Vite 8/oxc 尚未支持降级；锁定 vite@7 并用 esbuild 处理
  esbuild: { target: 'es2022' },
  test: {
    projects: ['packages/*'],
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['packages/*/src/**/*.{ts,js,mjs,cjs}'],
      exclude: ['packages/console/bin.mjs', '**/coverage/**', '**/.DS_Store'],
      // lines: 99,
      // functions: 99,
      // branches: 99,
      // statements: 99,
      reporter: ['html', 'lcovonly', 'text-summary'],
    },
    exclude: [...configDefaults.exclude, '**/dist/**'],
    maxConcurrency: 1,
    fileParallelism: false,
    // Vitest 5 默认 clearMocks=true；本仓库大量跨断言依赖调用记录，保持与 v3 一致
    clearMocks: false,
    logHeapUsage: true,
    environment: 'node',
    retry: 1,
    testTimeout: 15_000,
    globals: true,
    snapshotFormat: {
      escapeString: false,
      printBasicPrototype: false,
    },
    globalSetup: 'vitest.setup.ts',
    watch: false,
  },
});
