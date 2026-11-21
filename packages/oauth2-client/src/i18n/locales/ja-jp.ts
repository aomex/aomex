import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl は正の期間でなければなりません',
  client_id_empty: 'clientId は空にできません',
  client_secret_empty: 'clientSecret は空にできません',
  authorization_endpoint_empty: 'authorizationEndpoint は空にできません',
  token_endpoint_empty: 'tokenEndpoint は空にできません',
  redirect_uri_empty: 'redirectUri は空にできません',
  missing_code_or_state: 'code または state がありません',
  invalid_state: '無効または期限切れの state',
  authorization_denied: '認可が拒否されました：{{error}}',
  token_exchange_failed: 'access_token の交換に失敗しました',
  token_type_invalid: 'トークン応答の token_type が無効または未対応です',
  refresh_token_empty: 'refreshToken は空にできません',
  token_refresh_failed: 'access_token の更新に失敗しました',
  revoke_token_empty: 'token は空にできません',
  revocation_endpoint_empty:
    'revocationEndpoint が未設定で、discovery でも提供されていません',
  token_revoke_failed: 'トークンの取り消しに失敗しました',
  oidc_issuer_empty: 'oidc.issuer は空にできません',
  oidc_discovery_failed: 'OIDC discovery に失敗しました',
  oidc_issuer_mismatch: 'OIDC discovery が返した issuer が設定と一致しません',
  oidc_jwks_uri_missing: 'jwks_uri がありません',
  oidc_missing_id_token: 'トークン応答に id_token がありません',
  oidc_id_token_invalid: 'id_token の検証に失敗しました',
  oidc_nonce_mismatch: 'id_token の nonce が一致しません',
  oidc_at_hash_mismatch: 'id_token の at_hash が access_token と一致しません',
  oidc_azp_mismatch: 'id_token の azp 検証に失敗しました',
  callback_iss_mismatch: '認可コールバックの iss が設定と一致しません',
  callback_unsupported_response:
    '認可コールバックに未対応のインプリシット/ハイブリッドフローパラメータが含まれています',
});
