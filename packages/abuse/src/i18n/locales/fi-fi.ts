import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Tuntematon käyttäjän väärinkäytön syy: {{reason}}',
  unknown_ip_abuse_reason: 'Tuntematon IP-väärinkäytön syy: {{reason}}',
  duplicate_user_abuse_reason: 'Päällekkäinen käyttäjän väärinkäytön syy: {{reason}}',
  duplicate_ip_abuse_reason: 'Päällekkäinen IP-väärinkäytön syy: {{reason}}',
  missing_on_ban_user:
    'onBanUser on pakollinen, kun user-abuse-strategioita on määritetty',
  invalid_limit: 'limitin on oltava positiivinen kokonaisluku, saatu: {{limit}}',
  invalid_window: 'windowin on oltava positiivinen kesto, saatu: {{window}}',
  invalid_block_for: 'blockForin on oltava positiivinen kesto, saatu: {{blockFor}}',
  invalid_ban_for: 'banForin on oltava positiivinen kesto, saatu: {{banFor}}',
  empty_honeypot_paths: 'honeypot-strategian paths ei voi olla tyhjä',
  empty_http_error_status_codes: 'http-error-strategian statusCodes ei voi olla tyhjä',
  empty_socket_events: 'socket-events-strategian events ei voi olla tyhjä',
  blocked: 'Pääsy estetty',
});
