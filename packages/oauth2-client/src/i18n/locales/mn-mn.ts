import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl эерэг хугацаа байх ёстой',
  client_id_empty: 'clientId хоосон байж болохгүй',
  client_secret_empty: 'clientSecret хоосон байж болохгүй',
  authorization_endpoint_empty: 'authorizationEndpoint хоосон байж болохгүй',
  token_endpoint_empty: 'tokenEndpoint хоосон байж болохгүй',
  redirect_uri_empty: 'redirectUri хоосон байж болохгүй',
  missing_code_or_state: 'code эсвэл state байхгүй',
  invalid_state: 'Хүчингүй эсвэл хугацаа дууссан state',
  authorization_denied: 'Зөвшөөрөл татгалзагдлаа: {{error}}',
  token_exchange_failed: 'access_token солилцох амжилтгүй',
  token_type_invalid: 'Токен хариуны token_type хүчингүй эсвэл дэмжигдээгүй',
  refresh_token_empty: 'refreshToken хоосон байж болохгүй',
  token_refresh_failed: 'access_token шинэчлэх амжилтгүй',
  revoke_token_empty: 'token хоосон байж болохгүй',
  revocation_endpoint_empty: 'revocationEndpoint тохируулаагүй бөгөөд discovery өгөөгүй',
  token_revoke_failed: 'Токеныг хүчингүй болгох амжилтгүй',
  oidc_issuer_empty: 'oidc.issuer хоосон байж болохгүй',
  oidc_discovery_failed: 'OIDC discovery амжилтгүй',
  oidc_issuer_mismatch: 'OIDC discovery-ээс буцаасан issuer тохиргоотой таарахгүй',
  oidc_jwks_uri_missing: 'jwks_uri байхгүй',
  oidc_missing_id_token: 'Токен хариунд id_token байхгүй',
  oidc_id_token_invalid: 'id_token шалгалт амжилтгүй',
  oidc_nonce_mismatch: 'id_token-ийн nonce таарахгүй',
  oidc_at_hash_mismatch: 'id_token-ийн at_hash access_token-тай таарахгүй',
  oidc_azp_mismatch: 'id_token-ийн azp шалгалт амжилтгүй',
  callback_iss_mismatch: 'Зөвшөөрлийн буцаах дуудлагын iss тохиргоотой таарахгүй',
  callback_unsupported_response:
    'Зөвшөөрлийн буцаах дуудлагад дэмжигдээгүй implicit/hybrid урсгалын параметрүүд байна',
});
