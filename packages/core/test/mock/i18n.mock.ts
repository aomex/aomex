import { I18n, I18nMessage } from '../../src';

declare module '../../src' {
  export namespace I18n {
    export interface Locales {
      zh_TEST: true;
    }

    export interface Definition {
      test: {
        foo: {
          bar: {
            baz: I18nMessage<{ name: string }>;
          };
        };
      };
      optional: {
        foo: {
          bar: {
            baz: I18nMessage<{ label?: string }>;
          };
        };
      };
    }
  }
}

export const i18n = new I18n('zh_CN');
