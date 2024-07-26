import type { I18nMessage } from '@aomex/core';

declare module '@aomex/core' {
  export namespace I18n {
    export interface Definition {
      cache: {
        wrong_type: I18nMessage;
        not_integer: I18nMessage;
      };
    }
  }
}
