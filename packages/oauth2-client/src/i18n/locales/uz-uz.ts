import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl musbat davomiylik bo‘lishi kerak',
  client_id_empty: 'clientId bo‘sh bo‘lmasligi kerak',
  client_secret_empty: 'clientSecret bo‘sh bo‘lmasligi kerak',
  authorization_endpoint_empty: 'authorizationEndpoint bo‘sh bo‘lmasligi kerak',
  token_endpoint_empty: 'tokenEndpoint bo‘sh bo‘lmasligi kerak',
  redirect_uri_empty: 'redirectUri bo‘sh bo‘lmasligi kerak',
  missing_code_or_state: 'code yoki state yo‘q',
  invalid_state: 'Yaroqsiz yoki muddati o‘tgan state',
  authorization_denied: 'Ruxsat rad etildi: {{error}}',
  token_exchange_failed: 'access_token almashtirish muvaffaqiyatsiz',
  token_type_invalid: 'Token javobidagi token_type yaroqsiz yoki qo‘llab-quvvatlanmaydi',
  refresh_token_empty: 'refreshToken bo‘sh bo‘lmasligi kerak',
  token_refresh_failed: 'access_token yangilash muvaffaqiyatsiz',
  revoke_token_empty: 'token bo‘sh bo‘lmasligi kerak',
  revocation_endpoint_empty: 'revocationEndpoint sozlanmagan va discovery taqdim etmagan',
  token_revoke_failed: 'Tokenni bekor qilish muvaffaqiyatsiz',
  oidc_issuer_empty: 'oidc.issuer bo‘sh bo‘lmasligi kerak',
  oidc_discovery_failed: 'OIDC discovery muvaffaqiyatsiz',
  oidc_issuer_mismatch: 'OIDC discovery qaytargan issuer konfiguratsiyaga mos kelmaydi',
  oidc_jwks_uri_missing: 'jwks_uri yo‘q',
  oidc_missing_id_token: 'Token javobida id_token yo‘q',
  oidc_id_token_invalid: 'id_token tekshiruvi muvaffaqiyatsiz',
  oidc_nonce_mismatch: 'id_token nonce mos kelmaydi',
  oidc_at_hash_mismatch: 'id_token at_hash access_token bilan mos kelmaydi',
  oidc_azp_mismatch: 'id_token azp tekshiruvi muvaffaqiyatsiz',
  callback_iss_mismatch: 'Ruxsat qayta chaqiruvi iss konfiguratsiyaga mos kelmaydi',
  callback_unsupported_response:
    'Ruxsat qayta chaqiruvi qo‘llab-quvvatlanmaydigan implicit/hybrid oqim parametrlarini o‘z ichiga oladi',
});
