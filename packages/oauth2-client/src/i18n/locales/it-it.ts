import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl deve essere una durata positiva',
  client_id_empty: 'clientId non può essere vuoto',
  client_secret_empty: 'clientSecret non può essere vuoto',
  authorization_endpoint_empty: 'authorizationEndpoint non può essere vuoto',
  token_endpoint_empty: 'tokenEndpoint non può essere vuoto',
  redirect_uri_empty: 'redirectUri non può essere vuoto',
  missing_code_or_state: 'code o state mancante',
  invalid_state: 'state non valido o scaduto',
  authorization_denied: 'Autorizzazione negata: {{error}}',
  token_exchange_failed: 'Scambio di access_token non riuscito',
  token_type_invalid: 'token_type nella risposta del token non valido o non supportato',
  refresh_token_empty: 'refreshToken non può essere vuoto',
  token_refresh_failed: 'Aggiornamento di access_token non riuscito',
  revoke_token_empty: 'token non può essere vuoto',
  revocation_endpoint_empty:
    'revocationEndpoint non è configurato e discovery non ne ha fornito uno',
  token_revoke_failed: 'Revoca del token non riuscita',
  oidc_issuer_empty: 'oidc.issuer non può essere vuoto',
  oidc_discovery_failed: 'OIDC discovery non riuscito',
  oidc_issuer_mismatch:
    "L'issuer restituito da OIDC discovery non corrisponde alla configurazione",
  oidc_jwks_uri_missing: 'jwks_uri mancante',
  oidc_missing_id_token: 'La risposta del token non include id_token',
  oidc_id_token_invalid: 'Verifica di id_token non riuscita',
  oidc_nonce_mismatch: 'nonce di id_token non corrisponde',
  oidc_at_hash_mismatch: 'at_hash di id_token non corrisponde a access_token',
  oidc_azp_mismatch: 'Verifica di azp di id_token non riuscita',
  callback_iss_mismatch:
    'iss del callback di autorizzazione non corrisponde alla configurazione',
  callback_unsupported_response:
    'Il callback di autorizzazione contiene parametri di flusso implicito/ibrido non supportati',
});
