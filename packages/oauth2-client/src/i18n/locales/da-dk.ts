import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl skal være en positiv varighed',
  client_id_empty: 'clientId må ikke være tom',
  client_secret_empty: 'clientSecret må ikke være tom',
  authorization_endpoint_empty: 'authorizationEndpoint må ikke være tom',
  token_endpoint_empty: 'tokenEndpoint må ikke være tom',
  redirect_uri_empty: 'redirectUri må ikke være tom',
  missing_code_or_state: 'code eller state mangler',
  invalid_state: 'Ugyldig eller udløbet state',
  authorization_denied: 'Autorisation nægtet: {{error}}',
  token_exchange_failed: 'Kunne ikke bytte access_token',
  token_type_invalid: 'token_type i tokensvaret er ugyldig eller ikke understøttet',
  refresh_token_empty: 'refreshToken må ikke være tom',
  token_refresh_failed: 'Kunne ikke opdatere access_token',
  revoke_token_empty: 'token må ikke være tom',
  revocation_endpoint_empty:
    'revocationEndpoint er ikke konfigureret, og discovery leverede ingen',
  token_revoke_failed: 'Kunne ikke tilbagekalde token',
  oidc_issuer_empty: 'oidc.issuer må ikke være tom',
  oidc_discovery_failed: 'OIDC discovery mislykkedes',
  oidc_issuer_mismatch:
    'issuer fra OIDC discovery stemmer ikke overens med konfigurationen',
  oidc_jwks_uri_missing: 'jwks_uri mangler',
  oidc_missing_id_token: 'Tokensvaret mangler id_token',
  oidc_id_token_invalid: 'Verifikation af id_token mislykkedes',
  oidc_nonce_mismatch: 'nonce i id_token stemmer ikke overens',
  oidc_at_hash_mismatch: 'at_hash i id_token stemmer ikke overens med access_token',
  oidc_azp_mismatch: 'Verifikation af azp i id_token mislykkedes',
  callback_iss_mismatch:
    'iss i autorisationscallback stemmer ikke overens med konfigurationen',
  callback_unsupported_response:
    'Autorisationscallback indeholder ikke-understøttede implicit-/hybrid-flowparametre',
});
