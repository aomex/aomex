import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'அறியப்படாத பயனர் தவறான பயன்பாட்டு காரணம்: {{reason}}',
  unknown_ip_abuse_reason: 'அறியப்படாத IP தவறான பயன்பாட்டு காரணம்: {{reason}}',
  duplicate_user_abuse_reason: 'நகல் பயனர் தவறான பயன்பாட்டு காரணம்: {{reason}}',
  duplicate_ip_abuse_reason: 'நகல் IP தவறான பயன்பாட்டு காரணம்: {{reason}}',
  missing_on_ban_user: 'user-abuse உத்திகள் அமைக்கப்பட்டிருக்கும்போது onBanUser தேவை',
  invalid_limit: 'limit நேர்மறை முழு எண்ணாக இருக்க வேண்டும், பெற்றது: {{limit}}',
  invalid_window: 'window நேர்மறை கால அளவாக இருக்க வேண்டும், பெற்றது: {{window}}',
  invalid_block_for: 'blockFor நேர்மறை கால அளவாக இருக்க வேண்டும், பெற்றது: {{blockFor}}',
  invalid_ban_for: 'banFor நேர்மறை கால அளவாக இருக்க வேண்டும், பெற்றது: {{banFor}}',
  empty_honeypot_paths: 'honeypot உத்தியின் paths காலியாக இருக்கக்கூடாது',
  empty_http_error_status_codes: 'http-error உத்தியின் statusCodes காலியாக இருக்கக்கூடாது',
  empty_socket_events: 'socket-events உத்தியின் events காலியாக இருக்கக்கூடாது',
  blocked: 'அணுகல் மறுக்கப்பட்டது',
});
