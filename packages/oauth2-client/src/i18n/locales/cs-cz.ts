import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl musí být kladná doba trvání',
  client_id_empty: 'clientId nesmí být prázdný',
  client_secret_empty: 'clientSecret nesmí být prázdný',
  authorization_endpoint_empty: 'authorizationEndpoint nesmí být prázdný',
  token_endpoint_empty: 'tokenEndpoint nesmí být prázdný',
  redirect_uri_empty: 'redirectUri nesmí být prázdný',
  missing_code_or_state: 'Chybí code nebo state',
  invalid_state: 'Neplatný nebo vypršený state',
  authorization_denied: 'Autorizace zamítnuta: {{error}}',
  token_exchange_failed: 'Výměna access_token selhala',
  token_type_invalid: 'token_type v odpovědi tokenu je neplatný nebo nepodporovaný',
  refresh_token_empty: 'refreshToken nesmí být prázdný',
  token_refresh_failed: 'Obnovení access_token selhalo',
  revoke_token_empty: 'token nesmí být prázdný',
  revocation_endpoint_empty:
    'revocationEndpoint není nakonfigurován a discovery jej neposkytl',
  token_revoke_failed: 'Zrušení tokenu selhalo',
  oidc_issuer_empty: 'oidc.issuer nesmí být prázdný',
  oidc_discovery_failed: 'OIDC discovery selhalo',
  oidc_issuer_mismatch: 'issuer vrácený OIDC discovery neodpovídá konfiguraci',
  oidc_jwks_uri_missing: 'Chybí jwks_uri',
  oidc_missing_id_token: 'Odpověď tokenu neobsahuje id_token',
  oidc_id_token_invalid: 'Ověření id_token selhalo',
  oidc_nonce_mismatch: 'nonce v id_token se neshoduje',
  oidc_at_hash_mismatch: 'at_hash v id_token se neshoduje s access_token',
  oidc_azp_mismatch: 'Ověření azp v id_token selhalo',
  callback_iss_mismatch: 'iss v autorizačním callbacku neodpovídá konfiguraci',
  callback_unsupported_response:
    'Autorizační callback obsahuje nepodporované parametry implicitního/hybridního toku',
});
