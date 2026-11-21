import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（台灣） */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl 必須為正數時長',
  client_id_empty: 'clientId 不能為空',
  client_secret_empty: 'clientSecret 不能為空',
  authorization_endpoint_empty: 'authorizationEndpoint 不能為空',
  token_endpoint_empty: 'tokenEndpoint 不能為空',
  redirect_uri_empty: 'redirectUri 不能為空',
  missing_code_or_state: '缺少 code 或 state',
  invalid_state: '無效或已過期的 state',
  authorization_denied: '授權被拒絕：{{error}}',
  token_exchange_failed: '換取 access_token 失敗',
  token_type_invalid: '令牌回應 token_type 無效或不受支援',
  refresh_token_empty: 'refreshToken 不能為空',
  token_refresh_failed: '重新整理 access_token 失敗',
  revoke_token_empty: 'token 不能為空',
  revocation_endpoint_empty: 'revocationEndpoint 未設定且 discovery 未提供',
  token_revoke_failed: '撤銷令牌失敗',
  oidc_issuer_empty: 'oidc.issuer 不能為空',
  oidc_discovery_failed: 'OIDC discovery 失敗',
  oidc_issuer_mismatch: 'OIDC discovery 回傳的 issuer 與設定不一致',
  oidc_jwks_uri_missing: '缺少 jwks_uri',
  oidc_missing_id_token: '令牌回應缺少 id_token',
  oidc_id_token_invalid: 'id_token 校驗失敗',
  oidc_nonce_mismatch: 'id_token nonce 不相符',
  oidc_at_hash_mismatch: 'id_token at_hash 與 access_token 不相符',
  oidc_azp_mismatch: 'id_token azp 校驗失敗',
  callback_iss_mismatch: '授權回呼 iss 與設定不一致',
  callback_unsupported_response: '授權回呼含不受支援的隱式/混合流程參數',
});
