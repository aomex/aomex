import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl måste vara en positiv varaktighet',
  client_id_empty: 'clientId får inte vara tomt',
  client_secret_empty: 'clientSecret får inte vara tomt',
  authorization_endpoint_empty: 'authorizationEndpoint får inte vara tomt',
  token_endpoint_empty: 'tokenEndpoint får inte vara tomt',
  redirect_uri_empty: 'redirectUri får inte vara tomt',
  missing_code_or_state: 'code eller state saknas',
  invalid_state: 'Ogiltig eller utgången state',
  authorization_denied: 'Auktorisering nekad: {{error}}',
  token_exchange_failed: 'Misslyckades med att byta access_token',
  token_type_invalid: 'token_type i tokensvaret är ogiltigt eller stöds inte',
  refresh_token_empty: 'refreshToken får inte vara tomt',
  token_refresh_failed: 'Misslyckades med att uppdatera access_token',
  revoke_token_empty: 'token får inte vara tomt',
  revocation_endpoint_empty:
    'revocationEndpoint är inte konfigurerat och discovery tillhandahöll inget',
  token_revoke_failed: 'Misslyckades med att återkalla token',
  oidc_issuer_empty: 'oidc.issuer får inte vara tomt',
  oidc_discovery_failed: 'OIDC discovery misslyckades',
  oidc_issuer_mismatch: 'issuer från OIDC discovery stämmer inte med konfigurationen',
  oidc_jwks_uri_missing: 'jwks_uri saknas',
  oidc_missing_id_token: 'Tokensvaret saknar id_token',
  oidc_id_token_invalid: 'Verifiering av id_token misslyckades',
  oidc_nonce_mismatch: 'nonce i id_token stämmer inte',
  oidc_at_hash_mismatch: 'at_hash i id_token stämmer inte med access_token',
  oidc_azp_mismatch: 'Verifiering av azp i id_token misslyckades',
  callback_iss_mismatch: 'iss i auktoriseringscallback stämmer inte med konfigurationen',
  callback_unsupported_response:
    'Auktoriseringscallback innehåller icke stödda implicit-/hybridflödesparametrar',
});
