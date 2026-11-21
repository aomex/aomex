import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl phải là khoảng thời gian dương',
  client_id_empty: 'clientId không được để trống',
  client_secret_empty: 'clientSecret không được để trống',
  authorization_endpoint_empty: 'authorizationEndpoint không được để trống',
  token_endpoint_empty: 'tokenEndpoint không được để trống',
  redirect_uri_empty: 'redirectUri không được để trống',
  missing_code_or_state: 'Thiếu code hoặc state',
  invalid_state: 'state không hợp lệ hoặc đã hết hạn',
  authorization_denied: 'Ủy quyền bị từ chối: {{error}}',
  token_exchange_failed: 'Đổi access_token thất bại',
  token_type_invalid:
    'token_type trong phản hồi token không hợp lệ hoặc không được hỗ trợ',
  refresh_token_empty: 'refreshToken không được để trống',
  token_refresh_failed: 'Làm mới access_token thất bại',
  revoke_token_empty: 'token không được để trống',
  revocation_endpoint_empty:
    'revocationEndpoint chưa được cấu hình và discovery không cung cấp',
  token_revoke_failed: 'Thu hồi token thất bại',
  oidc_issuer_empty: 'oidc.issuer không được để trống',
  oidc_discovery_failed: 'OIDC discovery thất bại',
  oidc_issuer_mismatch: 'issuer do OIDC discovery trả về không khớp với cấu hình',
  oidc_jwks_uri_missing: 'Thiếu jwks_uri',
  oidc_missing_id_token: 'Phản hồi token thiếu id_token',
  oidc_id_token_invalid: 'Xác minh id_token thất bại',
  oidc_nonce_mismatch: 'nonce của id_token không khớp',
  oidc_at_hash_mismatch: 'at_hash của id_token không khớp với access_token',
  oidc_azp_mismatch: 'Xác minh azp của id_token thất bại',
  callback_iss_mismatch: 'iss của callback ủy quyền không khớp với cấu hình',
  callback_unsupported_response:
    'Callback ủy quyền chứa tham số luồng ẩn/hỗn hợp không được hỗ trợ',
});
