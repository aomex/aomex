import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'يجب أن يكون stateTtl مدة موجبة',
  client_id_empty: 'يجب ألا يكون clientId فارغًا',
  client_secret_empty: 'يجب ألا يكون clientSecret فارغًا',
  authorization_endpoint_empty: 'يجب ألا يكون authorizationEndpoint فارغًا',
  token_endpoint_empty: 'يجب ألا يكون tokenEndpoint فارغًا',
  redirect_uri_empty: 'يجب ألا يكون redirectUri فارغًا',
  missing_code_or_state: 'code أو state مفقود',
  invalid_state: 'state غير صالح أو منتهية صلاحيته',
  authorization_denied: 'رُفض التفويض: {{error}}',
  token_exchange_failed: 'فشل تبادل access_token',
  token_type_invalid: 'token_type في استجابة الرمز غير صالح أو غير مدعوم',
  refresh_token_empty: 'يجب ألا يكون refreshToken فارغًا',
  token_refresh_failed: 'فشل تحديث access_token',
  revoke_token_empty: 'يجب ألا يكون token فارغًا',
  revocation_endpoint_empty: 'revocationEndpoint غير مُعدّ وdiscovery لم يوفّره',
  token_revoke_failed: 'فشل إلغاء الرمز',
  oidc_issuer_empty: 'يجب ألا يكون oidc.issuer فارغًا',
  oidc_discovery_failed: 'فشل OIDC discovery',
  oidc_issuer_mismatch: 'issuer الذي أرجعه OIDC discovery لا يطابق الإعداد',
  oidc_jwks_uri_missing: 'jwks_uri مفقود',
  oidc_missing_id_token: 'استجابة الرمز تفتقد id_token',
  oidc_id_token_invalid: 'فشل التحقق من id_token',
  oidc_nonce_mismatch: 'nonce في id_token غير متطابق',
  oidc_at_hash_mismatch: 'at_hash في id_token لا يطابق access_token',
  oidc_azp_mismatch: 'فشل التحقق من azp في id_token',
  callback_iss_mismatch: 'iss في رد نداء التفويض لا يطابق الإعداد',
  callback_unsupported_response:
    'رد نداء التفويض يحتوي على معاملات تدفق ضمني/هجين غير مدعومة',
});
