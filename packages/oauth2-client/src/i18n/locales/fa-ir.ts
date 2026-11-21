import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl باید یک مدت مثبت باشد',
  client_id_empty: 'clientId نباید خالی باشد',
  client_secret_empty: 'clientSecret نباید خالی باشد',
  authorization_endpoint_empty: 'authorizationEndpoint نباید خالی باشد',
  token_endpoint_empty: 'tokenEndpoint نباید خالی باشد',
  redirect_uri_empty: 'redirectUri نباید خالی باشد',
  missing_code_or_state: 'code یا state موجود نیست',
  invalid_state: 'state نامعتبر یا منقضی شده',
  authorization_denied: 'مجوز رد شد: {{error}}',
  token_exchange_failed: 'تبدیل access_token ناموفق بود',
  token_type_invalid: 'token_type در پاسخ توکن نامعتبر یا پشتیبانی‌نشده است',
  refresh_token_empty: 'refreshToken نباید خالی باشد',
  token_refresh_failed: 'تازه‌سازی access_token ناموفق بود',
  revoke_token_empty: 'token نباید خالی باشد',
  revocation_endpoint_empty:
    'revocationEndpoint پیکربندی نشده و discovery آن را ارائه نکرده است',
  token_revoke_failed: 'ابطال توکن ناموفق بود',
  oidc_issuer_empty: 'oidc.issuer نباید خالی باشد',
  oidc_discovery_failed: 'OIDC discovery ناموفق بود',
  oidc_issuer_mismatch:
    'issuer بازگردانده‌شده توسط OIDC discovery با پیکربندی هم‌خوانی ندارد',
  oidc_jwks_uri_missing: 'jwks_uri موجود نیست',
  oidc_missing_id_token: 'پاسخ توکن فاقد id_token است',
  oidc_id_token_invalid: 'اعتبارسنجی id_token ناموفق بود',
  oidc_nonce_mismatch: 'nonce در id_token مطابقت ندارد',
  oidc_at_hash_mismatch: 'at_hash در id_token با access_token مطابقت ندارد',
  oidc_azp_mismatch: 'اعتبارسنجی azp در id_token ناموفق بود',
  callback_iss_mismatch: 'iss در فراخوانی بازگشتی مجوز با پیکربندی هم‌خوانی ندارد',
  callback_unsupported_response:
    'فراخوانی بازگشتی مجوز شامل پارامترهای جریان ضمنی/ترکیبی پشتیبانی‌نشده است',
});
