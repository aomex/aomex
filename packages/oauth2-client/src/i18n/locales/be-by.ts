import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl павінен быць дадатнай працягласцю',
  client_id_empty: 'clientId не павінен быць пустым',
  client_secret_empty: 'clientSecret не павінен быць пустым',
  authorization_endpoint_empty: 'authorizationEndpoint не павінен быць пустым',
  token_endpoint_empty: 'tokenEndpoint не павінен быць пустым',
  redirect_uri_empty: 'redirectUri не павінен быць пустым',
  missing_code_or_state: 'Адсутнічае code або state',
  invalid_state: 'Несапраўдны або пратэрмінаваны state',
  authorization_denied: 'Аўтарызацыя адхілена: {{error}}',
  token_exchange_failed: 'Не ўдалося абмяняць access_token',
  token_type_invalid: 'token_type у адказе токена несапраўдны або не падтрымліваецца',
  refresh_token_empty: 'refreshToken не павінен быць пустым',
  token_refresh_failed: 'Не ўдалося абнавіць access_token',
  revoke_token_empty: 'token не павінен быць пустым',
  revocation_endpoint_empty:
    'revocationEndpoint не наладжаны, і discovery яго не прадаставіў',
  token_revoke_failed: 'Не ўдалося адклікаць токен',
  oidc_issuer_empty: 'oidc.issuer не павінен быць пустым',
  oidc_discovery_failed: 'OIDC discovery не ўдаўся',
  oidc_issuer_mismatch: 'issuer, вернуты OIDC discovery, не супадае з канфігурацыяй',
  oidc_jwks_uri_missing: 'Адсутнічае jwks_uri',
  oidc_missing_id_token: 'У адказе токена адсутнічае id_token',
  oidc_id_token_invalid: 'Праверка id_token не ўдалася',
  oidc_nonce_mismatch: 'nonce у id_token не супадае',
  oidc_at_hash_mismatch: 'at_hash у id_token не супадае з access_token',
  oidc_azp_mismatch: 'Праверка azp у id_token не ўдалася',
  callback_iss_mismatch: 'iss у зваротным выкліку аўтарызацыі не супадае з канфігурацыяй',
  callback_unsupported_response:
    'Зваротны выклік аўтарызацыі змяшчае непадтрымліваныя параметры implicit/hybrid патоку',
});
