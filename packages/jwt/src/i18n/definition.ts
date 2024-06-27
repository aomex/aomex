import type { I18nMessage } from '@aomex/core';

declare module '@aomex/core' {
  export namespace I18n {
    export interface Definition {
      jwt: {
        revoked: I18nMessage;
      };
    }
  }
}
