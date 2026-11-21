import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl має бути додатною тривалістю',
  client_id_empty: 'clientId не повинен бути порожнім',
  client_secret_empty: 'clientSecret не повинен бути порожнім',
  authorization_endpoint_empty: 'authorizationEndpoint не повинен бути порожнім',
  token_endpoint_empty: 'tokenEndpoint не повинен бути порожнім',
  redirect_uri_empty: 'redirectUri не повинен бути порожнім',
  missing_code_or_state: 'Відсутній code або state',
  invalid_state: 'Недійсний або прострочений state',
  authorization_denied: 'Авторизацію відхилено: {{error}}',
  token_exchange_failed: 'Не вдалося обміняти access_token',
  token_type_invalid: 'token_type у відповіді токена недійсний або не підтримується',
  refresh_token_empty: 'refreshToken не повинен бути порожнім',
  token_refresh_failed: 'Не вдалося оновити access_token',
  revoke_token_empty: 'token не повинен бути порожнім',
  revocation_endpoint_empty:
    'revocationEndpoint не налаштовано, і discovery його не надав',
  token_revoke_failed: 'Не вдалося відкликати токен',
  oidc_issuer_empty: 'oidc.issuer не повинен бути порожнім',
  oidc_discovery_failed: 'OIDC discovery не вдався',
  oidc_issuer_mismatch:
    'issuer, повернутий OIDC discovery, не збігається з конфігурацією',
  oidc_jwks_uri_missing: 'Відсутній jwks_uri',
  oidc_missing_id_token: 'У відповіді токена відсутній id_token',
  oidc_id_token_invalid: 'Перевірка id_token не вдалася',
  oidc_nonce_mismatch: 'nonce у id_token не збігається',
  oidc_at_hash_mismatch: 'at_hash у id_token не збігається з access_token',
  oidc_azp_mismatch: 'Перевірка azp у id_token не вдалася',
  callback_iss_mismatch:
    'iss у зворотному виклику авторизації не збігається з конфігурацією',
  callback_unsupported_response:
    'Зворотний виклик авторизації містить непідтримувані параметри implicit/hybrid flow',
});
