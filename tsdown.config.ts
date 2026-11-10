import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  clean: true,
  format: ['esm'],
  platform: 'node',
  // 与现有 publishConfig 的 .js / .d.ts 路径对齐
  fixedExtension: false,
  tsconfig: './tsconfig.json',
  target: 'node24',
  shims: false,
  dts: true,
});
