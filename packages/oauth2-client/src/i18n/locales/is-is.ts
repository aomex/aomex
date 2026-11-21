import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl verður að vera jákvæð lengd',
  client_id_empty: 'clientId má ekki vera autt',
  client_secret_empty: 'clientSecret má ekki vera autt',
  authorization_endpoint_empty: 'authorizationEndpoint má ekki vera autt',
  token_endpoint_empty: 'tokenEndpoint má ekki vera autt',
  redirect_uri_empty: 'redirectUri má ekki vera autt',
  missing_code_or_state: 'code eða state vantar',
  invalid_state: 'Ógilt eða útrunnið state',
  authorization_denied: 'Heimild hafnað: {{error}}',
  token_exchange_failed: 'Mistókst að skipta access_token',
  token_type_invalid: 'token_type í svari er ógilt eða ekki stutt',
  refresh_token_empty: 'refreshToken má ekki vera autt',
  token_refresh_failed: 'Mistókst að endurnýja access_token',
  revoke_token_empty: 'token má ekki vera autt',
  revocation_endpoint_empty:
    'revocationEndpoint er ekki stillt og discovery gaf ekkert upp',
  token_revoke_failed: 'Mistókst að afturkalla tákn',
  oidc_issuer_empty: 'oidc.issuer má ekki vera autt',
  oidc_discovery_failed: 'OIDC discovery mistókst',
  oidc_issuer_mismatch: 'issuer frá OIDC discovery passar ekki við stillingar',
  oidc_jwks_uri_missing: 'jwks_uri vantar',
  oidc_missing_id_token: 'Svarið vantar id_token',
  oidc_id_token_invalid: 'Staðfesting id_token mistókst',
  oidc_nonce_mismatch: 'nonce í id_token passar ekki',
  oidc_at_hash_mismatch: 'at_hash í id_token passar ekki við access_token',
  oidc_azp_mismatch: 'Staðfesting azp í id_token mistókst',
  callback_iss_mismatch: 'iss í heimildarsvörun passar ekki við stillingar',
  callback_unsupported_response:
    'Heimildarsvörun inniheldur óstuddar implicit/hybrid flæðisbreytur',
});
