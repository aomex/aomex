import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl مثبت مدت ہونی چاہیے',
  client_id_empty: 'clientId خالی نہیں ہو سکتا',
  client_secret_empty: 'clientSecret خالی نہیں ہو سکتا',
  authorization_endpoint_empty: 'authorizationEndpoint خالی نہیں ہو سکتا',
  token_endpoint_empty: 'tokenEndpoint خالی نہیں ہو سکتا',
  redirect_uri_empty: 'redirectUri خالی نہیں ہو سکتا',
  missing_code_or_state: 'code یا state موجود نہیں',
  invalid_state: 'غلط یا میعاد ختم شدہ state',
  authorization_denied: 'اجازت مسترد: {{error}}',
  token_exchange_failed: 'access_token کا تبادلہ ناکام',
  token_type_invalid: 'ٹوکن جواب کا token_type غلط یا غیر معاون ہے',
  refresh_token_empty: 'refreshToken خالی نہیں ہو سکتا',
  token_refresh_failed: 'access_token کی تجدید ناکام',
  revoke_token_empty: 'token خالی نہیں ہو سکتا',
  revocation_endpoint_empty:
    'revocationEndpoint ترتیب نہیں دیا گیا اور discovery نے فراہم نہیں کیا',
  token_revoke_failed: 'ٹوکن منسوخ کرنا ناکام',
  oidc_issuer_empty: 'oidc.issuer خالی نہیں ہو سکتا',
  oidc_discovery_failed: 'OIDC discovery ناکام',
  oidc_issuer_mismatch: 'OIDC discovery کا واپس کردہ issuer ترتیب سے میل نہیں کھاتا',
  oidc_jwks_uri_missing: 'jwks_uri موجود نہیں',
  oidc_missing_id_token: 'ٹوکن جواب میں id_token نہیں ہے',
  oidc_id_token_invalid: 'id_token کی تصدیق ناکام',
  oidc_nonce_mismatch: 'id_token کا nonce میل نہیں کھاتا',
  oidc_at_hash_mismatch: 'id_token کا at_hash، access_token سے میل نہیں کھاتا',
  oidc_azp_mismatch: 'id_token کے azp کی تصدیق ناکام',
  callback_iss_mismatch: 'اجازت کال بیک کا iss ترتیب سے میل نہیں کھاتا',
  callback_unsupported_response:
    'اجازت کال بیک میں غیر معاون ضمنی/ہائبرڈ فلو پیرامیٹرز ہیں',
});
