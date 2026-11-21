import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason:
    'Nezināms lietotāja ļaunprātīgas izmantošanas iemesls: {{reason}}',
  unknown_ip_abuse_reason: 'Nezināms IP ļaunprātīgas izmantošanas iemesls: {{reason}}',
  duplicate_user_abuse_reason:
    'Dublēts lietotāja ļaunprātīgas izmantošanas iemesls: {{reason}}',
  duplicate_ip_abuse_reason: 'Dublēts IP ļaunprātīgas izmantošanas iemesls: {{reason}}',
  missing_on_ban_user:
    'Kad ir konfigurētas user-abuse stratēģijas, onBanUser ir obligāts',
  invalid_limit: 'limit jābūt pozitīvam veselam skaitlim, saņemts: {{limit}}',
  invalid_window: 'window jābūt pozitīvam ilgumam, saņemts: {{window}}',
  invalid_block_for: 'blockFor jābūt pozitīvam ilgumam, saņemts: {{blockFor}}',
  invalid_ban_for: 'banFor jābūt pozitīvam ilgumam, saņemts: {{banFor}}',
  empty_honeypot_paths: 'honeypot stratēģijas paths nedrīkst būt tukšs',
  empty_http_error_status_codes: 'http-error stratēģijas statusCodes nedrīkst būt tukšs',
});
