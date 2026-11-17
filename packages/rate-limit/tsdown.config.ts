import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/memory-store.ts'],
  sourcemap: true,
  clean: true,
  format: ['esm'],
  platform: 'node',
  fixedExtension: false,
  tsconfig: '../../tsconfig.json',
  target: 'node24',
  shims: false,
  dts: true,
});
