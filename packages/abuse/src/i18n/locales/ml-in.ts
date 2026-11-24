import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'അജ്ഞാത ഉപയോക്തൃ ദുരുപയോഗ കാരണം: {{reason}}',
  unknown_ip_abuse_reason: 'അജ്ഞാത IP ദുരുപയോഗ കാരണം: {{reason}}',
  duplicate_user_abuse_reason: 'ഡ്യൂപ്ലിക്കേറ്റ് ഉപയോക്തൃ ദുരുപയോഗ കാരണം: {{reason}}',
  duplicate_ip_abuse_reason: 'ഡ്യൂപ്ലിക്കേറ്റ് IP ദുരുപയോഗ കാരണം: {{reason}}',
  missing_on_ban_user: 'user-abuse തന്ത്രങ്ങൾ ക്രമീകരിക്കുമ്പോൾ onBanUser ആവശ്യമാണ്',
  invalid_limit: 'limit ഒരു ധനാത്മക പൂർണസംഖ്യയായിരിക്കണം, ലഭിച്ചത്: {{limit}}',
  invalid_window: 'window ഒരു ധനാത്മക കാലയളവായിരിക്കണം, ലഭിച്ചത്: {{window}}',
  invalid_block_for: 'blockFor ഒരു ധനാത്മക കാലയളവായിരിക്കണം, ലഭിച്ചത്: {{blockFor}}',
  invalid_ban_for: 'banFor ഒരു ധനാത്മക കാലയളവായിരിക്കണം, ലഭിച്ചത്: {{banFor}}',
  empty_honeypot_paths: 'honeypot തന്ത്രത്തിന്റെ paths ശൂന്യമാകരുത്',
  empty_http_error_status_codes: 'http-error തന്ത്രത്തിന്റെ statusCodes ശൂന്യമാകരുത്',
  empty_socket_events: 'socket-events തന്ത്രത്തിന്റെ events ശൂന്യമാകരുത്',
  blocked: 'പ്രവേശനം നിരസിച്ചു',
});
