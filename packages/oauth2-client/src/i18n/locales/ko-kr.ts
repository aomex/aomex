import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl은 양수 기간이어야 합니다',
  client_id_empty: 'clientId는 비워둘 수 없습니다',
  client_secret_empty: 'clientSecret은 비워둘 수 없습니다',
  authorization_endpoint_empty: 'authorizationEndpoint는 비워둘 수 없습니다',
  token_endpoint_empty: 'tokenEndpoint는 비워둘 수 없습니다',
  redirect_uri_empty: 'redirectUri는 비워둘 수 없습니다',
  missing_code_or_state: 'code 또는 state가 없습니다',
  invalid_state: '유효하지 않거나 만료된 state',
  authorization_denied: '권한이 거부됨: {{error}}',
  token_exchange_failed: 'access_token 교환에 실패했습니다',
  token_type_invalid: '토큰 응답의 token_type이 유효하지 않거나 지원되지 않습니다',
  refresh_token_empty: 'refreshToken은 비워둘 수 없습니다',
  token_refresh_failed: 'access_token 갱신에 실패했습니다',
  revoke_token_empty: 'token은 비워둘 수 없습니다',
  revocation_endpoint_empty:
    'revocationEndpoint가 구성되지 않았고 discovery에서도 제공되지 않았습니다',
  token_revoke_failed: '토큰 폐기에 실패했습니다',
  oidc_issuer_empty: 'oidc.issuer는 비워둘 수 없습니다',
  oidc_discovery_failed: 'OIDC discovery에 실패했습니다',
  oidc_issuer_mismatch: 'OIDC discovery가 반환한 issuer가 구성과 일치하지 않습니다',
  oidc_jwks_uri_missing: 'jwks_uri가 없습니다',
  oidc_missing_id_token: '토큰 응답에 id_token이 없습니다',
  oidc_id_token_invalid: 'id_token 검증에 실패했습니다',
  oidc_nonce_mismatch: 'id_token nonce가 일치하지 않습니다',
  oidc_at_hash_mismatch: 'id_token at_hash가 access_token과 일치하지 않습니다',
  oidc_azp_mismatch: 'id_token azp 검증에 실패했습니다',
  callback_iss_mismatch: '권한 부여 콜백 iss가 구성과 일치하지 않습니다',
  callback_unsupported_response:
    '권한 부여 콜백에 지원되지 않는 암시적/하이브리드 흐름 매개변수가 포함되어 있습니다',
});
