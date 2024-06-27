import type { I18nMessage } from '@aomex/core';

declare module '@aomex/core' {
  export namespace I18n {
    export interface Definition {
      web: {
        validator: {
          file: {
            must_be_file: I18nMessage<{ label: string }>;
            too_large: I18nMessage<{ label: string }>;
            unsupported_mimetype: I18nMessage<{ label: string }>;
          };
        };
        response: {
          redirect: I18nMessage<{ url: string }>;
        };
      };
    }
  }
}
