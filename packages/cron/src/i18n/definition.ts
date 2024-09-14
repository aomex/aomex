import type { I18nMessage } from '@aomex/core';

declare module '@aomex/core' {
  export namespace I18n {
    export interface Definition {
      cron: {
        eject: I18nMessage;
        start: I18nMessage;
        stop: I18nMessage;
        stats: I18nMessage;
        not_started: I18nMessage<{ port: number }>;
      };
    }
  }
}
