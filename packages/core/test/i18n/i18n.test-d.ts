import { expectType } from 'ts-expect';
import { I18nMessage, i18n } from '../../src';

declare module '../../src' {
  export namespace I18n {
    export interface Locales {
      CHECK: true;
    }

    export interface Definition {
      check: {
        foo: {
          bar: {
            baz: I18nMessage<{ name: string }>;
          };
          test1: I18nMessage;
          test2: I18nMessage<{ name?: string; age: number }>;
        };
      };
    }
  }
}

// 注册
{
  i18n.register('CHECK', 'check', {
    foo: {
      bar: { baz: '' },
      test1: '',
      test2: {
        message: '',
        args: {
          name: 'default value',
          age(arg) {
            expectType<number>(arg);
            return 'ok';
          },
        },
      },
    },
  });

  i18n.register(
    'CHECK',
    // @ts-expect-error
    'test123',
    {},
  );

  i18n.register(
    // @ts-expect-error
    'CHECK1',
    'test123',
    {},
  );

  i18n.register('CHECK', 'check', {
    // @ts-expect-error
    foo: {
      bar: { baz: '' },
      test1: '',
    },
  });

  i18n.register('CHECK', 'check', {
    foo: {
      bar: { baz: '' },
      test1: '',
      test2: '',
      // @ts-expect-error
      test3: '',
    },
  });
}

// 翻译
{
  i18n.t('check.foo.test1');
  // @ts-expect-error
  i18n.t('check.foo.test1', {});

  i18n.t('check.foo.test2', { age: 10 });
  i18n.t('check.foo.test2', { name: 'jim', age: 10 });
  // @ts-expect-error
  i18n.t('check.foo.test2');
  // @ts-expect-error
  i18n.t('check.foo.test2', {});
  // @ts-expect-error
  i18n.t('check.foo.test2', { name: 12, age: 10 });
  // @ts-expect-error
  i18n.t('check.foo.test2', { name: 12, age: 10, other: '' });
  // @ts-expect-error
  i18n.t('check.foo.test2', { name: 'jim', age: 'jim' });

  // @ts-expect-error
  i18n.t('check.foo.test3');
  // @ts-expect-error
  i18n.t('check.foo.test3', {});
  // @ts-expect-error
  i18n.t('Check.foo.test1');
}

// 覆盖
{
  i18n.override('CHECK', {
    check: {
      foo: { test1: 'test1' },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: { bar: { baz: 'ok' } },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: {
        bar: { baz: { message: 'ok', args: { name: 'ttt' } } },
      },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: {
        test2: {
          message: 'ok',
          args: {
            name(arg) {
              expectType<string | undefined>(arg);
              return '';
            },
          },
        },
      },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: {
        test2: {
          message: 'ok',
          args: {
            age(arg) {
              expectType<number>(arg);
              return '';
            },
          },
        },
      },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: { bar: undefined },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: { bar: {} },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: {
        bar: {
          // @ts-expect-error
          baz: {
            message: 'ok',
          },
        },
      },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: {
        bar: {
          // @ts-expect-error
          baz: {
            args: { name: '' },
          },
        },
      },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: {
        bar: {
          baz: {
            message: 'z',
            // @ts-expect-error
            args: '',
          },
        },
      },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: {
        bar: {
          baz: {
            message: '',
            args: {
              // @ts-expect-error
              a: '',
            },
          },
        },
      },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: {
        // @ts-expect-error
        test3: '',
      },
    },
  });

  i18n.override('CHECK', {
    check: {
      foo: {
        // @ts-expect-error
        bar: '',
      },
    },
  });
}
