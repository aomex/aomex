import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl muss eine positive Dauer sein',
  client_id_empty: 'clientId darf nicht leer sein',
  client_secret_empty: 'clientSecret darf nicht leer sein',
  authorization_endpoint_empty: 'authorizationEndpoint darf nicht leer sein',
  token_endpoint_empty: 'tokenEndpoint darf nicht leer sein',
  redirect_uri_empty: 'redirectUri darf nicht leer sein',
  missing_code_or_state: 'code oder state fehlt',
  invalid_state: 'Ungültiger oder abgelaufener state',
  authorization_denied: 'Autorisierung verweigert: {{error}}',
  token_exchange_failed: 'Austausch von access_token fehlgeschlagen',
  token_type_invalid:
    'token_type in der Token-Antwort ist ungültig oder nicht unterstützt',
  refresh_token_empty: 'refreshToken darf nicht leer sein',
  token_refresh_failed: 'Aktualisierung von access_token fehlgeschlagen',
  revoke_token_empty: 'token darf nicht leer sein',
  revocation_endpoint_empty:
    'revocationEndpoint ist nicht konfiguriert und discovery hat keinen bereitgestellt',
  token_revoke_failed: 'Widerruf des Tokens fehlgeschlagen',
  oidc_issuer_empty: 'oidc.issuer darf nicht leer sein',
  oidc_discovery_failed: 'OIDC discovery fehlgeschlagen',
  oidc_issuer_mismatch:
    'Der von OIDC discovery zurückgegebene issuer stimmt nicht mit der Konfiguration überein',
  oidc_jwks_uri_missing: 'jwks_uri fehlt',
  oidc_missing_id_token: 'Token-Antwort enthält kein id_token',
  oidc_id_token_invalid: 'id_token-Überprüfung fehlgeschlagen',
  oidc_nonce_mismatch: 'id_token nonce stimmt nicht überein',
  oidc_at_hash_mismatch: 'id_token at_hash stimmt nicht mit access_token überein',
  oidc_azp_mismatch: 'id_token azp-Überprüfung fehlgeschlagen',
  callback_iss_mismatch:
    'iss im Autorisierungs-Callback stimmt nicht mit der Konfiguration überein',
  callback_unsupported_response:
    'Autorisierungs-Callback enthält nicht unterstützte Implicit-/Hybrid-Flow-Parameter',
});
