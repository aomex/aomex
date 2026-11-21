import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl ha de ser una durada positiva',
  client_id_empty: 'clientId no pot estar buit',
  client_secret_empty: 'clientSecret no pot estar buit',
  authorization_endpoint_empty: 'authorizationEndpoint no pot estar buit',
  token_endpoint_empty: 'tokenEndpoint no pot estar buit',
  redirect_uri_empty: 'redirectUri no pot estar buit',
  missing_code_or_state: 'Falta code o state',
  invalid_state: 'state no vàlid o caducat',
  authorization_denied: 'Autorització denegada: {{error}}',
  token_exchange_failed: "No s'ha pogut intercanviar access_token",
  token_type_invalid: 'token_type de la resposta de testimoni no vàlid o no compatible',
  refresh_token_empty: 'refreshToken no pot estar buit',
  token_refresh_failed: "No s'ha pogut actualitzar access_token",
  revoke_token_empty: 'token no pot estar buit',
  revocation_endpoint_empty:
    "revocationEndpoint no està configurat i discovery no l'ha proporcionat",
  token_revoke_failed: "No s'ha pogut revocar el testimoni",
  oidc_issuer_empty: 'oidc.issuer no pot estar buit',
  oidc_discovery_failed: 'OIDC discovery ha fallat',
  oidc_issuer_mismatch:
    "L'issuer retornat per OIDC discovery no coincideix amb la configuració",
  oidc_jwks_uri_missing: 'Falta jwks_uri',
  oidc_missing_id_token: 'La resposta de testimoni no inclou id_token',
  oidc_id_token_invalid: "Ha fallat la verificació d'id_token",
  oidc_nonce_mismatch: "El nonce d'id_token no coincideix",
  oidc_at_hash_mismatch: "L'at_hash d'id_token no coincideix amb access_token",
  oidc_azp_mismatch: "Ha fallat la verificació d'azp d'id_token",
  callback_iss_mismatch:
    "L'iss de la devolució d'autorització no coincideix amb la configuració",
  callback_unsupported_response:
    "La devolució d'autorització conté paràmetres de flux implícit/híbrid no compatibles",
});
