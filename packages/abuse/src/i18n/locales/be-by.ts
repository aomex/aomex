import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Невядомая прычына злоўжывання карыстальнікам: {{reason}}',
  unknown_ip_abuse_reason: 'Невядомая прычына злоўжывання IP: {{reason}}',
  duplicate_user_abuse_reason: 'Паўторная прычына злоўжывання карыстальнікам: {{reason}}',
  duplicate_ip_abuse_reason: 'Паўторная прычына злоўжывання IP: {{reason}}',
  missing_on_ban_user: 'Калі наладжаны стратэгіі user-abuse, неабходна падаць onBanUser',
  invalid_limit: 'limit павінен быць дадатным цэлым лікам, атрымана: {{limit}}',
  invalid_window: 'window павінен быць дадатнай працягласцю, атрымана: {{window}}',
  invalid_block_for: 'blockFor павінен быць дадатнай працягласцю, атрымана: {{blockFor}}',
  invalid_ban_for: 'banFor павінен быць дадатнай працягласцю, атрымана: {{banFor}}',
  empty_honeypot_paths: 'paths стратэгіі honeypot не можа быць пустым',
  empty_http_error_status_codes: 'statusCodes стратэгіі http-error не можа быць пустым',
  empty_socket_events: 'events стратэгіі socket-events не можа быць пустым',
  blocked: 'Доступ забаронены',
});
