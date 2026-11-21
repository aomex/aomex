import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl müsbət müddət olmalıdır',
  client_id_empty: 'clientId boş ola bilməz',
  client_secret_empty: 'clientSecret boş ola bilməz',
  authorization_endpoint_empty: 'authorizationEndpoint boş ola bilməz',
  token_endpoint_empty: 'tokenEndpoint boş ola bilməz',
  redirect_uri_empty: 'redirectUri boş ola bilməz',
  missing_code_or_state: 'code və ya state çatışmır',
  invalid_state: 'Etibarsız və ya müddəti bitmiş state',
  authorization_denied: 'İcazə rədd edildi: {{error}}',
  token_exchange_failed: 'access_token mübadiləsi uğursuz oldu',
  token_type_invalid: 'Token cavabındakı token_type etibarsızdır və ya dəstəklənmir',
  refresh_token_empty: 'refreshToken boş ola bilməz',
  token_refresh_failed: 'access_token yenilənməsi uğursuz oldu',
  revoke_token_empty: 'token boş ola bilməz',
  revocation_endpoint_empty:
    'revocationEndpoint konfiqurasiya edilməyib və discovery təmin etməyib',
  token_revoke_failed: 'Tokenin ləğvi uğursuz oldu',
  oidc_issuer_empty: 'oidc.issuer boş ola bilməz',
  oidc_discovery_failed: 'OIDC discovery uğursuz oldu',
  oidc_issuer_mismatch:
    'OIDC discovery tərəfindən qaytarılan issuer konfiqurasiya ilə uyğun gəlmir',
  oidc_jwks_uri_missing: 'jwks_uri çatışmır',
  oidc_missing_id_token: 'Token cavabında id_token yoxdur',
  oidc_id_token_invalid: 'id_token yoxlanması uğursuz oldu',
  oidc_nonce_mismatch: 'id_token nonce uyğun gəlmir',
  oidc_at_hash_mismatch: 'id_token at_hash, access_token ilə uyğun gəlmir',
  oidc_azp_mismatch: 'id_token azp yoxlanması uğursuz oldu',
  callback_iss_mismatch: 'İcazə geri çağırışındakı iss konfiqurasiya ilə uyğun gəlmir',
  callback_unsupported_response:
    'İcazə geri çağırışı dəstəklənməyən implicit/hybrid axın parametrləri ehtiva edir',
});
