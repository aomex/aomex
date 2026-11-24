import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'მომხმარებლის ბოროტად გამოყენების უცნობი მიზეზი: {{reason}}',
  unknown_ip_abuse_reason: 'IP-ის ბოროტად გამოყენების უცნობი მიზეზი: {{reason}}',
  duplicate_user_abuse_reason:
    'მომხმარებლის ბოროტად გამოყენების გამეორებული მიზეზი: {{reason}}',
  duplicate_ip_abuse_reason: 'IP-ის ბოროტად გამოყენების გამეორებული მიზეზი: {{reason}}',
  missing_on_ban_user: 'user-abuse სტრატეგიების კონფიგურაციისას onBanUser სავალდებულოა',
  invalid_limit: 'limit უნდა იყოს დადებითი მთელი რიცხვი, მიღებული: {{limit}}',
  invalid_window: 'window უნდა იყოს დადებითი ხანგრძლივობა, მიღებული: {{window}}',
  invalid_block_for: 'blockFor უნდა იყოს დადებითი ხანგრძლივობა, მიღებული: {{blockFor}}',
  invalid_ban_for: 'banFor უნდა იყოს დადებითი ხანგრძლივობა, მიღებული: {{banFor}}',
  empty_honeypot_paths: 'honeypot სტრატეგიის paths არ შეიძლება იყოს ცარიელი',
  empty_http_error_status_codes:
    'http-error სტრატეგიის statusCodes არ შეიძლება იყოს ცარიელი',
  empty_socket_events: 'socket-events სტრატეგიის events არ შეიძლება იყოს ცარიელი',
  blocked: 'წვდომა აკრძალულია',
});
