import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl må være en positiv varighet',
  client_id_empty: 'clientId kan ikke være tom',
  client_secret_empty: 'clientSecret kan ikke være tom',
  authorization_endpoint_empty: 'authorizationEndpoint kan ikke være tom',
  token_endpoint_empty: 'tokenEndpoint kan ikke være tom',
  redirect_uri_empty: 'redirectUri kan ikke være tom',
  missing_code_or_state: 'code eller state mangler',
  invalid_state: 'Ugyldig eller utløpt state',
  authorization_denied: 'Autorisasjon nektet: {{error}}',
  token_exchange_failed: 'Klarte ikke å bytte access_token',
  token_type_invalid: 'token_type i tokensvaret er ugyldig eller ikke støttet',
  refresh_token_empty: 'refreshToken kan ikke være tom',
  token_refresh_failed: 'Klarte ikke å oppdatere access_token',
  revoke_token_empty: 'token kan ikke være tom',
  revocation_endpoint_empty:
    'revocationEndpoint er ikke konfigurert og discovery ga ingen',
  token_revoke_failed: 'Klarte ikke å tilbakekalle token',
  oidc_issuer_empty: 'oidc.issuer kan ikke være tom',
  oidc_discovery_failed: 'OIDC discovery mislyktes',
  oidc_issuer_mismatch: 'issuer fra OIDC discovery samsvarer ikke med konfigurasjonen',
  oidc_jwks_uri_missing: 'jwks_uri mangler',
  oidc_missing_id_token: 'Tokensvaret mangler id_token',
  oidc_id_token_invalid: 'Verifisering av id_token mislyktes',
  oidc_nonce_mismatch: 'nonce i id_token samsvarer ikke',
  oidc_at_hash_mismatch: 'at_hash i id_token samsvarer ikke med access_token',
  oidc_azp_mismatch: 'Verifisering av azp i id_token mislyktes',
  callback_iss_mismatch: 'iss i autorisasjonscallback samsvarer ikke med konfigurasjonen',
  callback_unsupported_response:
    'Autorisasjonscallback inneholder ikke-støttede implicit-/hybrid-flytparametere',
});
