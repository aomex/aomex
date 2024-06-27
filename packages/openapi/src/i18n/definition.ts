import type { I18nMessage } from '@aomex/core';

declare module '@aomex/core' {
  export namespace I18n {
    export interface Definition {
      openapi: {
        initialize: I18nMessage;
        search_routers_files: I18nMessage;
        parse_routers: I18nMessage;
        add_tag: I18nMessage;
        hand_fix_documentation: I18nMessage;
        optimize_parameter: I18nMessage;
        save_to_file: I18nMessage;
        validate: I18nMessage;
        help_summary: I18nMessage;
        has_error: I18nMessage<{ error_count: number; warning_count: number }>;
        no_error: I18nMessage;
      };
    }
  }
}
