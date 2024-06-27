import type { I18nMessage } from './i18n-message';

declare module '../i18n' {
  export namespace I18n {
    export interface Definition {
      core: {
        validator: {
          required: I18nMessage<{ label: string }>;
          validation_failed: I18nMessage;

          array: {
            must_be_array: I18nMessage<{ label: string }>;
            length_not_in_range: I18nMessage<{ label: string }>;
          };
          boolean: {
            must_be_boolean: I18nMessage<{ label: string }>;
          };
          buffer: {
            must_be_buffer: I18nMessage<{ label: string }>;
          };
          stream: {
            must_be_stream: I18nMessage<{ label: string }>;
          };
          dateTime: {
            must_be_date: I18nMessage<{ label: string }>;
            not_in_range: I18nMessage<{ label: string }>;
          };
          number: {
            must_be_number: I18nMessage<{ label: string }>;
            must_be_integer: I18nMessage<{ label: string }>;
            must_be_bigint: I18nMessage<{ label: string }>;
            not_in_range: I18nMessage<{ label: string }>;
          };
          string: {
            must_be_string: I18nMessage<{ label: string }>;
            must_be_email: I18nMessage<{ label: string }>;
            must_be_hash: I18nMessage<{ label: string }>;
            must_be_ulid: I18nMessage<{ label: string }>;
            must_be_uuid: I18nMessage<{ label: string; versions: string }>;
            must_be_ip: I18nMessage<{ label: string; versions: string }>;
            length_not_in_range: I18nMessage<{ label: string }>;
            not_match_pattern: I18nMessage<{ label: string }>;
          };
          url: {
            must_be_url: I18nMessage<{ label: string }>;
            unsupported_scheme: I18nMessage<{ label: string; scheme: string }>;
          };
          object: {
            must_be_object: I18nMessage<{ label: string }>;
          };
          enum: {
            not_in_range: I18nMessage<{ label: string }>;
            only_support_string_number: I18nMessage;
            can_not_be_empty: I18nMessage<{ item: any }>;
          };
          one_of: {
            not_match_rule: I18nMessage<{ label: string }>;
          };
        };
        middleware: {
          call_next_multiple: I18nMessage;
        };
      };
    }
  }
}
