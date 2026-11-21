import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl мора да биде позитивно времетраење',
  client_id_empty: 'clientId не смее да биде празен',
  client_secret_empty: 'clientSecret не смее да биде празен',
  authorization_endpoint_empty: 'authorizationEndpoint не смее да биде празен',
  token_endpoint_empty: 'tokenEndpoint не смее да биде празен',
  redirect_uri_empty: 'redirectUri не смее да биде празен',
  missing_code_or_state: 'Недостасува code или state',
  invalid_state: 'Неважечки или истечен state',
  authorization_denied: 'Авторизацијата е одбиена: {{error}}',
  token_exchange_failed: 'Размената на access_token не успеа',
  token_type_invalid: 'token_type во одговорот на токенот е неважечки или не е поддржан',
  refresh_token_empty: 'refreshToken не смее да биде празен',
  token_refresh_failed: 'Освежувањето на access_token не успеа',
  revoke_token_empty: 'token не смее да биде празен',
  revocation_endpoint_empty:
    'revocationEndpoint не е конфигуриран и discovery не го обезбеди',
  token_revoke_failed: 'Повикувањето на токенот не успеа',
  oidc_issuer_empty: 'oidc.issuer не смее да биде празен',
  oidc_discovery_failed: 'OIDC discovery не успеа',
  oidc_issuer_mismatch:
    'issuer вратен од OIDC discovery не се совпаѓа со конфигурацијата',
  oidc_jwks_uri_missing: 'Недостасува jwks_uri',
  oidc_missing_id_token: 'Одговорот на токенот нема id_token',
  oidc_id_token_invalid: 'Проверката на id_token не успеа',
  oidc_nonce_mismatch: 'nonce во id_token не се совпаѓа',
  oidc_at_hash_mismatch: 'at_hash во id_token не се совпаѓа со access_token',
  oidc_azp_mismatch: 'Проверката на azp во id_token не успеа',
  callback_iss_mismatch:
    'iss во повратниот повик за авторизација не се совпаѓа со конфигурацијата',
  callback_unsupported_response:
    'Повратниот повик за авторизација содржи неподдржани параметри на implicit/hybrid тек',
});
