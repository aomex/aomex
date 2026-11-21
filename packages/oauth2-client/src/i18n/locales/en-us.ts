import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl must be a positive duration',
  client_id_empty: 'clientId must not be empty',
  client_secret_empty: 'clientSecret must not be empty',
  authorization_endpoint_empty: 'authorizationEndpoint must not be empty',
  token_endpoint_empty: 'tokenEndpoint must not be empty',
  redirect_uri_empty: 'redirectUri must not be empty',
  missing_code_or_state: 'Missing code or state',
  invalid_state: 'Invalid or expired state',
  authorization_denied: 'Authorization denied: {{error}}',
  token_exchange_failed: 'Failed to exchange access_token',
  token_type_invalid: 'Token response token_type is missing or unsupported',
  refresh_token_empty: 'refreshToken must not be empty',
  token_refresh_failed: 'Failed to refresh access_token',
  revoke_token_empty: 'token must not be empty',
  revocation_endpoint_empty:
    'revocationEndpoint is not configured and discovery did not provide one',
  token_revoke_failed: 'Failed to revoke token',
  oidc_issuer_empty: 'oidc.issuer must not be empty',
  oidc_discovery_failed: 'OIDC discovery failed',
  oidc_issuer_mismatch: 'OIDC discovery issuer does not match the configured issuer',
  oidc_jwks_uri_missing: 'Missing jwks_uri',
  oidc_missing_id_token: 'Token response is missing id_token',
  oidc_id_token_invalid: 'id_token verification failed',
  oidc_nonce_mismatch: 'id_token nonce mismatch',
  oidc_at_hash_mismatch: 'id_token at_hash does not match access_token',
  oidc_azp_mismatch: 'id_token azp verification failed',
  callback_iss_mismatch:
    'Authorization callback iss does not match the configured issuer',
  callback_unsupported_response:
    'Authorization callback contains unsupported implicit/hybrid parameters',
});
