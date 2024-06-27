import { afterEach, expect, test } from 'vitest';
import { i18n } from '../mock/i18n.mock';

afterEach(() => {
  i18n['contents'] = {};
});

test('设置语言', () => {
  i18n.setLocale('zh_CN');
  expect(i18n.getLocale()).toBe('zh_CN');
  i18n.setLocale('en_US');
  expect(i18n.getLocale()).toBe('en_US');
});

test('垫底语言', () => {
  i18n.setFallbackLocale('zh_CN');
  expect(i18n.getFallbackLocale()).toBe('zh_CN');
  i18n.setFallbackLocale('en_US');
  expect(i18n.getFallbackLocale()).toBe('en_US');
});

test('翻译', () => {
  i18n.register('zh_CN', 'test', {
    foo: { bar: { baz: '你好，{{name}}' } },
  });
  i18n.register('en_US', 'test', {
    foo: { bar: { baz: 'hello, {{name}}' } },
  });

  i18n.setLocale('zh_CN');
  expect(i18n.t('test.foo.bar.baz', { name: '世界' })).toBe('你好，世界');
  i18n.setLocale('en_US');
  expect(i18n.t('test.foo.bar.baz', { name: 'world' })).toBe('hello, world');
});

test('找不到时使用默认的语言', () => {
  i18n.register('zh_CN', 'test', {
    foo: { bar: { baz: '你好，{{name}}' } },
  });
  i18n.setLocale('en_US').setFallbackLocale('zh_CN');
  expect(i18n.t('test.foo.bar.baz', { name: 'world' })).toBe('你好，world');
});

test('默认语言也找不到时直接返回key', () => {
  i18n.register('zh_CN', 'test', {
    foo: { bar: { baz: '你好，{{name}}' } },
  });
  i18n.setLocale('en_US').setFallbackLocale('zh_CN');
  // @ts-expect-error
  expect(i18n.t('test.foo.bar.baz1', { name: 'world' })).toBe('test.foo.bar.baz1');
});

test('翻译手动指定语言时，未找到直接返回key', () => {
  i18n.register('zh_CN', 'test', {
    foo: { bar: { baz: '你好，{{name}}' } },
  });
  i18n.setLocale('en_US').setFallbackLocale('zh_CN');
  expect(i18n.t('test.foo.bar.baz', { name: 'world' }, 'en_US')).toBe('test.foo.bar.baz');
});

test('设置默认值', () => {
  i18n.register('zh_CN', 'optional', {
    foo: {
      bar: { baz: { message: '你好，{{label}}', args: { label: '地球' } } },
    },
  });

  i18n.setLocale('zh_CN');
  expect(i18n.t('optional.foo.bar.baz', {})).toBe('你好，地球');
  expect(i18n.t('optional.foo.bar.baz', { label: '世界' })).toBe('你好，世界');
});

test('使用函数处理', () => {
  i18n.register('zh_CN', 'test', {
    foo: {
      bar: { baz: { message: '你好，{{name}}', args: { name: (arg) => arg.repeat(2) } } },
    },
  });

  i18n.setLocale('zh_CN');
  expect(i18n.t('test.foo.bar.baz', { name: '世界' })).toBe('你好，世界世界');
});

test('变量未匹配', () => {
  i18n.register('zh_CN', 'test', {
    foo: {
      bar: { baz: '你好，{{name1}}' },
    },
  });

  i18n.setLocale('zh_CN');
  expect(i18n.t('test.foo.bar.baz', { name: '世界' })).toBe('你好，{{name1}}');
});

test('覆盖配置', () => {
  i18n.register('zh_CN', 'test', {
    foo: {
      bar: { baz: '你好，{{name}}' },
      // @ts-expect-error
      test1: 'test123',
    },
  });
  i18n.register('en_US', 'test', {
    foo: { bar: { baz: 'hello, {{name}}' } },
  });

  i18n.override('zh_CN', {
    test: {
      foo: {
        bar: {
          baz: '你好吗？{{name}}',
        },
      },
    },
  });

  i18n.setLocale('zh_CN');
  expect(i18n.t('test.foo.bar.baz', { name: '世界' })).toBe('你好吗？世界');

  i18n.override('zh_CN', {
    test: {
      foo: {
        bar: {
          baz: {
            message: '我很好，{{name}}',
            args: {
              name(name) {
                return name.repeat(2);
              },
            },
          },
        },
      },
    },
  });
  expect(i18n.t('test.foo.bar.baz', { name: '世界' })).toBe('我很好，世界世界');

  // @ts-expect-error
  expect(i18n.t('test.foo.test1')).toBe('test123');
  i18n.setLocale('en_US');
  expect(i18n.t('test.foo.bar.baz', { name: 'world' })).toBe('hello, world');
});
