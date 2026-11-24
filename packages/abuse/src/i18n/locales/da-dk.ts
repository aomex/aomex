import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Ukendt årsag til brugermisbrug: {{reason}}',
  unknown_ip_abuse_reason: 'Ukendt årsag til IP-misbrug: {{reason}}',
  duplicate_user_abuse_reason: 'Duplikeret årsag til brugermisbrug: {{reason}}',
  duplicate_ip_abuse_reason: 'Duplikeret årsag til IP-misbrug: {{reason}}',
  missing_on_ban_user: 'onBanUser er påkrævet, når user-abuse-strategier er konfigureret',
  invalid_limit: 'limit skal være et positivt heltal, modtaget: {{limit}}',
  invalid_window: 'window skal være en positiv varighed, modtaget: {{window}}',
  invalid_block_for: 'blockFor skal være en positiv varighed, modtaget: {{blockFor}}',
  invalid_ban_for: 'banFor skal være en positiv varighed, modtaget: {{banFor}}',
  empty_honeypot_paths: 'paths for honeypot-strategien må ikke være tom',
  empty_http_error_status_codes: 'statusCodes for http-error-strategien må ikke være tom',
  empty_socket_events: 'events for socket-events-strategien må ikke være tom',
  blocked: 'Adgang nægtet',
});
