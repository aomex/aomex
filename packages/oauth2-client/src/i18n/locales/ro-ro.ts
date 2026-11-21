import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl trebuie să fie o durată pozitivă',
  client_id_empty: 'clientId nu trebuie să fie gol',
  client_secret_empty: 'clientSecret nu trebuie să fie gol',
  authorization_endpoint_empty: 'authorizationEndpoint nu trebuie să fie gol',
  token_endpoint_empty: 'tokenEndpoint nu trebuie să fie gol',
  redirect_uri_empty: 'redirectUri nu trebuie să fie gol',
  missing_code_or_state: 'Lipsește code sau state',
  invalid_state: 'state invalid sau expirat',
  authorization_denied: 'Autorizare refuzată: {{error}}',
  token_exchange_failed: 'Schimbul access_token a eșuat',
  token_type_invalid: 'token_type din răspunsul de token este invalid sau nesuportat',
  refresh_token_empty: 'refreshToken nu trebuie să fie gol',
  token_refresh_failed: 'Reîmprospătarea access_token a eșuat',
  revoke_token_empty: 'token nu trebuie să fie gol',
  revocation_endpoint_empty:
    'revocationEndpoint nu este configurat și discovery nu l-a furnizat',
  token_revoke_failed: 'Revocarea tokenului a eșuat',
  oidc_issuer_empty: 'oidc.issuer nu trebuie să fie gol',
  oidc_discovery_failed: 'OIDC discovery a eșuat',
  oidc_issuer_mismatch: 'issuer returnat de OIDC discovery nu corespunde configurației',
  oidc_jwks_uri_missing: 'Lipsește jwks_uri',
  oidc_missing_id_token: 'Răspunsul de token nu conține id_token',
  oidc_id_token_invalid: 'Verificarea id_token a eșuat',
  oidc_nonce_mismatch: 'nonce din id_token nu corespunde',
  oidc_at_hash_mismatch: 'at_hash din id_token nu corespunde cu access_token',
  oidc_azp_mismatch: 'Verificarea azp din id_token a eșuat',
  callback_iss_mismatch: 'iss din callback-ul de autorizare nu corespunde configurației',
  callback_unsupported_response:
    'Callback-ul de autorizare conține parametri de flux implicit/hibrid nesuportați',
});
