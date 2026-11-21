import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Ukjent årsak til brukermisbruk: {{reason}}',
  unknown_ip_abuse_reason: 'Ukjent årsak til IP-misbruk: {{reason}}',
  duplicate_user_abuse_reason: 'Duplisert årsak til brukermisbruk: {{reason}}',
  duplicate_ip_abuse_reason: 'Duplisert årsak til IP-misbruk: {{reason}}',
  missing_on_ban_user: 'onBanUser er påkrevd når user-abuse-strategier er konfigurert',
  invalid_limit: 'limit må være et positivt heltall, mottatt: {{limit}}',
  invalid_window: 'window må være en positiv varighet, mottatt: {{window}}',
  invalid_block_for: 'blockFor må være en positiv varighet, mottatt: {{blockFor}}',
  invalid_ban_for: 'banFor må være en positiv varighet, mottatt: {{banFor}}',
  empty_honeypot_paths: 'paths for honeypot-strategien kan ikke være tom',
  empty_http_error_status_codes:
    'statusCodes for http-error-strategien kan ikke være tom',
});
