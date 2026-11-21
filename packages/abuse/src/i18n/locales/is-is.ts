import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Óþekkt ástæða fyrir misnotkun notanda: {{reason}}',
  unknown_ip_abuse_reason: 'Óþekkt ástæða fyrir misnotkun IP: {{reason}}',
  duplicate_user_abuse_reason: 'Tvítekin ástæða fyrir misnotkun notanda: {{reason}}',
  duplicate_ip_abuse_reason: 'Tvítekin ástæða fyrir misnotkun IP: {{reason}}',
  missing_on_ban_user: 'onBanUser er nauðsynlegt þegar user-abuse aðferðir eru stilltar',
  invalid_limit: 'limit verður að vera jákvæð heiltala, móttekið: {{limit}}',
  invalid_window: 'window verður að vera jákvæð tímalengd, móttekið: {{window}}',
  invalid_block_for: 'blockFor verður að vera jákvæð tímalengd, móttekið: {{blockFor}}',
  invalid_ban_for: 'banFor verður að vera jákvæð tímalengd, móttekið: {{banFor}}',
  empty_honeypot_paths: 'paths fyrir honeypot aðferð má ekki vera tómt',
  empty_http_error_status_codes: 'statusCodes fyrir http-error aðferð má ekki vera tómt',
});
