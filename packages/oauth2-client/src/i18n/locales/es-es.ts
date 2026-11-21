import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl debe ser una duración positiva',
  client_id_empty: 'clientId no debe estar vacío',
  client_secret_empty: 'clientSecret no debe estar vacío',
  authorization_endpoint_empty: 'authorizationEndpoint no debe estar vacío',
  token_endpoint_empty: 'tokenEndpoint no debe estar vacío',
  redirect_uri_empty: 'redirectUri no debe estar vacío',
  missing_code_or_state: 'Falta code o state',
  invalid_state: 'state inválido o expirado',
  authorization_denied: 'Autorización denegada: {{error}}',
  token_exchange_failed: 'Error al intercambiar access_token',
  token_type_invalid: 'token_type de la respuesta de token inválido o no admitido',
  refresh_token_empty: 'refreshToken no debe estar vacío',
  token_refresh_failed: 'Error al actualizar access_token',
  revoke_token_empty: 'token no debe estar vacío',
  revocation_endpoint_empty:
    'revocationEndpoint no está configurado y discovery no lo proporcionó',
  token_revoke_failed: 'Error al revocar el token',
  oidc_issuer_empty: 'oidc.issuer no debe estar vacío',
  oidc_discovery_failed: 'OIDC discovery falló',
  oidc_issuer_mismatch:
    'El issuer devuelto por OIDC discovery no coincide con la configuración',
  oidc_jwks_uri_missing: 'Falta jwks_uri',
  oidc_missing_id_token: 'La respuesta de token no incluye id_token',
  oidc_id_token_invalid: 'Falló la verificación de id_token',
  oidc_nonce_mismatch: 'nonce de id_token no coincide',
  oidc_at_hash_mismatch: 'at_hash de id_token no coincide con access_token',
  oidc_azp_mismatch: 'Falló la verificación de azp de id_token',
  callback_iss_mismatch:
    'iss de la devolución de autorización no coincide con la configuración',
  callback_unsupported_response:
    'La devolución de autorización contiene parámetros de flujo implícito/híbrido no admitidos',
});
