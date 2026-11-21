import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl pozitif bir süre olmalıdır',
  client_id_empty: 'clientId boş olamaz',
  client_secret_empty: 'clientSecret boş olamaz',
  authorization_endpoint_empty: 'authorizationEndpoint boş olamaz',
  token_endpoint_empty: 'tokenEndpoint boş olamaz',
  redirect_uri_empty: 'redirectUri boş olamaz',
  missing_code_or_state: 'code veya state eksik',
  invalid_state: 'Geçersiz veya süresi dolmuş state',
  authorization_denied: 'Yetkilendirme reddedildi: {{error}}',
  token_exchange_failed: 'access_token değiştirilemedi',
  token_type_invalid: 'Token yanıtındaki token_type geçersiz veya desteklenmiyor',
  refresh_token_empty: 'refreshToken boş olamaz',
  token_refresh_failed: 'access_token yenilenemedi',
  revoke_token_empty: 'token boş olamaz',
  revocation_endpoint_empty:
    'revocationEndpoint yapılandırılmamış ve discovery sağlamadı',
  token_revoke_failed: 'Token iptal edilemedi',
  oidc_issuer_empty: 'oidc.issuer boş olamaz',
  oidc_discovery_failed: 'OIDC discovery başarısız',
  oidc_issuer_mismatch:
    'OIDC discovery tarafından dönen issuer yapılandırmayla eşleşmiyor',
  oidc_jwks_uri_missing: 'jwks_uri eksik',
  oidc_missing_id_token: 'Token yanıtında id_token yok',
  oidc_id_token_invalid: 'id_token doğrulaması başarısız',
  oidc_nonce_mismatch: 'id_token nonce eşleşmiyor',
  oidc_at_hash_mismatch: 'id_token at_hash, access_token ile eşleşmiyor',
  oidc_azp_mismatch: 'id_token azp doğrulaması başarısız',
  callback_iss_mismatch: 'Yetkilendirme geri çağrısındaki iss yapılandırmayla eşleşmiyor',
  callback_unsupported_response:
    'Yetkilendirme geri çağrısı desteklenmeyen örtük/hibrit akış parametreleri içeriyor',
});
