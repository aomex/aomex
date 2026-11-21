import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl трябва да е положителна продължителност',
  client_id_empty: 'clientId не трябва да е празен',
  client_secret_empty: 'clientSecret не трябва да е празен',
  authorization_endpoint_empty: 'authorizationEndpoint не трябва да е празен',
  token_endpoint_empty: 'tokenEndpoint не трябва да е празен',
  redirect_uri_empty: 'redirectUri не трябва да е празен',
  missing_code_or_state: 'Липсва code или state',
  invalid_state: 'Невалиден или изтекъл state',
  authorization_denied: 'Упълномощаването е отказано: {{error}}',
  token_exchange_failed: 'Неуспешна размяна на access_token',
  token_type_invalid: 'token_type в отговора с токен е невалиден или не се поддържа',
  refresh_token_empty: 'refreshToken не трябва да е празен',
  token_refresh_failed: 'Неуспешно обновяване на access_token',
  revoke_token_empty: 'token не трябва да е празен',
  revocation_endpoint_empty:
    'revocationEndpoint не е конфигуриран и discovery не го предостави',
  token_revoke_failed: 'Неуспешно отменяне на токена',
  oidc_issuer_empty: 'oidc.issuer не трябва да е празен',
  oidc_discovery_failed: 'OIDC discovery се провали',
  oidc_issuer_mismatch: 'issuer, върнат от OIDC discovery, не съвпада с конфигурацията',
  oidc_jwks_uri_missing: 'Липсва jwks_uri',
  oidc_missing_id_token: 'Отговорът с токен няма id_token',
  oidc_id_token_invalid: 'Проверката на id_token се провали',
  oidc_nonce_mismatch: 'nonce в id_token не съвпада',
  oidc_at_hash_mismatch: 'at_hash в id_token не съвпада с access_token',
  oidc_azp_mismatch: 'Проверката на azp в id_token се провали',
  callback_iss_mismatch:
    'iss в обратното извикване за упълномощаване не съвпада с конфигурацията',
  callback_unsupported_response:
    'Обратното извикване за упълномощаване съдържа неподдържани параметри на implicit/hybrid поток',
});
