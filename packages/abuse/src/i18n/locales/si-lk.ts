import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'නොදන්නා පරිශීලක අනිසි භාවිත හේතුව: {{reason}}',
  unknown_ip_abuse_reason: 'නොදන්නා IP අනිසි භාවිත හේතුව: {{reason}}',
  duplicate_user_abuse_reason: 'අනුපිටපත් පරිශීලක අනිසි භාවිත හේතුව: {{reason}}',
  duplicate_ip_abuse_reason: 'අනුපිටපත් IP අනිසි භාවිත හේතුව: {{reason}}',
  missing_on_ban_user: 'user-abuse උපාය මාර්ග සකස් කර ඇති විට onBanUser අවශ්‍ය වේ',
  invalid_limit: 'limit ධන පූර්ණ සංඛ්‍යාවක් විය යුතුය, ලැබුණේ: {{limit}}',
  invalid_window: 'window ධන කාල සීමාවක් විය යුතුය, ලැබුණේ: {{window}}',
  invalid_block_for: 'blockFor ධන කාල සීමාවක් විය යුතුය, ලැබුණේ: {{blockFor}}',
  invalid_ban_for: 'banFor ධන කාල සීමාවක් විය යුතුය, ලැබුණේ: {{banFor}}',
  empty_honeypot_paths: 'honeypot උපාය මාර්ගයේ paths හිස් විය නොහැක',
  empty_http_error_status_codes: 'http-error උපාය මාර්ගයේ statusCodes හිස් විය නොහැක',
  empty_socket_events: 'socket-events උපාය මාර්ගයේ events හිස් විය නොහැක',
  blocked: 'ප්‍රවේශය ප්‍රතික්ෂේප විය',
});
