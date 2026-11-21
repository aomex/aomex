import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl moet een positieve duur zijn',
  client_id_empty: 'clientId mag niet leeg zijn',
  client_secret_empty: 'clientSecret mag niet leeg zijn',
  authorization_endpoint_empty: 'authorizationEndpoint mag niet leeg zijn',
  token_endpoint_empty: 'tokenEndpoint mag niet leeg zijn',
  redirect_uri_empty: 'redirectUri mag niet leeg zijn',
  missing_code_or_state: 'code of state ontbreekt',
  invalid_state: 'Ongeldige of verlopen state',
  authorization_denied: 'Autorisatie geweigerd: {{error}}',
  token_exchange_failed: 'Uitwisselen van access_token mislukt',
  token_type_invalid: 'token_type in tokenrespons is ongeldig of niet ondersteund',
  refresh_token_empty: 'refreshToken mag niet leeg zijn',
  token_refresh_failed: 'Vernieuwen van access_token mislukt',
  revoke_token_empty: 'token mag niet leeg zijn',
  revocation_endpoint_empty:
    'revocationEndpoint is niet geconfigureerd en discovery heeft er geen opgegeven',
  token_revoke_failed: 'Intrekken van token mislukt',
  oidc_issuer_empty: 'oidc.issuer mag niet leeg zijn',
  oidc_discovery_failed: 'OIDC discovery mislukt',
  oidc_issuer_mismatch:
    'De door OIDC discovery geretourneerde issuer komt niet overeen met de configuratie',
  oidc_jwks_uri_missing: 'jwks_uri ontbreekt',
  oidc_missing_id_token: 'Tokenrespons mist id_token',
  oidc_id_token_invalid: 'Verificatie van id_token mislukt',
  oidc_nonce_mismatch: 'nonce van id_token komt niet overeen',
  oidc_at_hash_mismatch: 'at_hash van id_token komt niet overeen met access_token',
  oidc_azp_mismatch: 'Verificatie van azp van id_token mislukt',
  callback_iss_mismatch:
    'iss van autorisatiecallback komt niet overeen met de configuratie',
  callback_unsupported_response:
    'Autorisatiecallback bevat niet-ondersteunde implicit-/hybrid-flowparameters',
});
