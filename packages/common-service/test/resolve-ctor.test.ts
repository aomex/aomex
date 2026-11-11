import { expect, test } from 'vitest';
import { Service } from '../src';
import { isServiceCtor, loadCtor, resolveCtor } from '../src/resolve-ctor.js';

class DemoService extends Service {
  ok() {
    return true;
  }
}

test('isServiceCtor', () => {
  expect(isServiceCtor(DemoService)).toBe(true);
  expect(isServiceCtor(Service)).toBe(false);
  expect(isServiceCtor(() => Promise.resolve(DemoService))).toBe(false);
  expect(isServiceCtor({})).toBe(false);
  expect(isServiceCtor(null)).toBe(false);
});

test('resolveCtor：整体是 Class', () => {
  expect(resolveCtor(DemoService, 'demo')).toBe(DemoService);
});

test('resolveCtor：default', () => {
  expect(resolveCtor({ default: DemoService }, 'demo')).toBe(DemoService);
});

test('resolveCtor：唯一命名导出', () => {
  expect(resolveCtor({ DemoService, helper: 1 }, 'demo')).toBe(DemoService);
});

test('resolveCtor：多个 Service 与类型一样不选用', () => {
  class A extends Service {}
  class B extends Service {}
  expect(() => resolveCtor({ A, B }, 'demo')).toThrow(/expected a Service class/);
});

test('resolveCtor：找不到报错', () => {
  expect(() => resolveCtor({ helper: 1 }, 'demo')).toThrow(/expected a Service class/);
  expect(() => resolveCtor(null, 'demo')).toThrow(/expected a Service class/);
});

test('resolveCtor：default 优先于其它命名', () => {
  class Other extends Service {}
  expect(resolveCtor({ default: DemoService, Other }, 'demo')).toBe(DemoService);
});

test('loadCtor：工厂', async () => {
  expect(await loadCtor(async () => DemoService, 'demo')).toBe(DemoService);
  expect(await loadCtor(async () => ({ default: DemoService }), 'demo')).toBe(
    DemoService,
  );
});
