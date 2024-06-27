import type { I18nMessage } from '@aomex/core';

declare module '@aomex/core' {
  export namespace I18n {
    export interface Definition {
      console: {
        command_not_found: I18nMessage<{ command: string }>;
        command_found_recommended: I18nMessage<{
          command: string;
          recommended: string;
        }>;
      };
    }
  }
}
