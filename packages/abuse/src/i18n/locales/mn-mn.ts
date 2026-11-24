import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason:
    'Хэрэглэгчийн зүй бус ашиглалтын үл мэдэгдэх шалтгаан: {{reason}}',
  unknown_ip_abuse_reason: 'IP-ийн зүй бус ашиглалтын үл мэдэгдэх шалтгаан: {{reason}}',
  duplicate_user_abuse_reason:
    'Хэрэглэгчийн зүй бус ашиглалтын давхардсан шалтгаан: {{reason}}',
  duplicate_ip_abuse_reason: 'IP-ийн зүй бус ашиглалтын давхардсан шалтгаан: {{reason}}',
  missing_on_ban_user:
    'user-abuse стратеги тохируулсан үед onBanUser заавал шаардлагатай',
  invalid_limit: 'limit эерэг бүхэл тоо байх ёстой, хүлээн авсан: {{limit}}',
  invalid_window: 'window эерэг хугацаа байх ёстой, хүлээн авсан: {{window}}',
  invalid_block_for: 'blockFor эерэг хугацаа байх ёстой, хүлээн авсан: {{blockFor}}',
  invalid_ban_for: 'banFor эерэг хугацаа байх ёстой, хүлээн авсан: {{banFor}}',
  empty_honeypot_paths: 'honeypot стратегийн paths хоосон байж болохгүй',
  empty_http_error_status_codes: 'http-error стратегийн statusCodes хоосон байж болохгүй',
  empty_socket_events: 'socket-events стратегийн events хоосон байж болохгүй',
  blocked: 'Хандалт хориглосон',
});
