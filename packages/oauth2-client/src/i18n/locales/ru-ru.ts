import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl должен быть положительной длительностью',
  client_id_empty: 'clientId не должен быть пустым',
  client_secret_empty: 'clientSecret не должен быть пустым',
  authorization_endpoint_empty: 'authorizationEndpoint не должен быть пустым',
  token_endpoint_empty: 'tokenEndpoint не должен быть пустым',
  redirect_uri_empty: 'redirectUri не должен быть пустым',
  missing_code_or_state: 'Отсутствует code или state',
  invalid_state: 'Недействительный или истёкший state',
  authorization_denied: 'Авторизация отклонена: {{error}}',
  token_exchange_failed: 'Не удалось обменять access_token',
  token_type_invalid: 'token_type в ответе токена недействителен или не поддерживается',
  refresh_token_empty: 'refreshToken не должен быть пустым',
  token_refresh_failed: 'Не удалось обновить access_token',
  revoke_token_empty: 'token не должен быть пустым',
  revocation_endpoint_empty:
    'revocationEndpoint не настроен, и discovery его не предоставил',
  token_revoke_failed: 'Не удалось отозвать токен',
  oidc_issuer_empty: 'oidc.issuer не должен быть пустым',
  oidc_discovery_failed: 'OIDC discovery не удался',
  oidc_issuer_mismatch:
    'issuer, возвращённый OIDC discovery, не совпадает с конфигурацией',
  oidc_jwks_uri_missing: 'Отсутствует jwks_uri',
  oidc_missing_id_token: 'В ответе токена отсутствует id_token',
  oidc_id_token_invalid: 'Проверка id_token не удалась',
  oidc_nonce_mismatch: 'nonce в id_token не совпадает',
  oidc_at_hash_mismatch: 'at_hash в id_token не совпадает с access_token',
  oidc_azp_mismatch: 'Проверка azp в id_token не удалась',
  callback_iss_mismatch: 'iss в обратном вызове авторизации не совпадает с конфигурацией',
  callback_unsupported_response:
    'Обратный вызов авторизации содержит неподдерживаемые параметры implicit/hybrid flow',
});
