import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl debe ser unha duración positiva',
  client_id_empty: 'clientId non pode estar baleiro',
  client_secret_empty: 'clientSecret non pode estar baleiro',
  authorization_endpoint_empty: 'authorizationEndpoint non pode estar baleiro',
  token_endpoint_empty: 'tokenEndpoint non pode estar baleiro',
  redirect_uri_empty: 'redirectUri non pode estar baleiro',
  missing_code_or_state: 'Falta code ou state',
  invalid_state: 'state non válido ou caducado',
  authorization_denied: 'Autorización denegada: {{error}}',
  token_exchange_failed: 'Fallou o intercambio de access_token',
  token_type_invalid: 'token_type da resposta do token non válido ou non admitido',
  refresh_token_empty: 'refreshToken non pode estar baleiro',
  token_refresh_failed: 'Fallou a actualización de access_token',
  revoke_token_empty: 'token non pode estar baleiro',
  revocation_endpoint_empty:
    'revocationEndpoint non está configurado e discovery non o proporcionou',
  token_revoke_failed: 'Fallou a revogación do token',
  oidc_issuer_empty: 'oidc.issuer non pode estar baleiro',
  oidc_discovery_failed: 'OIDC discovery fallou',
  oidc_issuer_mismatch:
    'O issuer devolto por OIDC discovery non coincide coa configuración',
  oidc_jwks_uri_missing: 'Falta jwks_uri',
  oidc_missing_id_token: 'A resposta do token non inclúe id_token',
  oidc_id_token_invalid: 'Fallou a verificación de id_token',
  oidc_nonce_mismatch: 'O nonce de id_token non coincide',
  oidc_at_hash_mismatch: 'O at_hash de id_token non coincide con access_token',
  oidc_azp_mismatch: 'Fallou a verificación de azp de id_token',
  callback_iss_mismatch:
    'O iss da devolución de autorización non coincide coa configuración',
  callback_unsupported_response:
    'A devolución de autorización contén parámetros de fluxo implícito/híbrido non admitidos',
});
