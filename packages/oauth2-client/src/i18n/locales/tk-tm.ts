import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl oňyn dowamlylyk bolmaly',
  client_id_empty: 'clientId boş bolmaly däl',
  client_secret_empty: 'clientSecret boş bolmaly däl',
  authorization_endpoint_empty: 'authorizationEndpoint boş bolmaly däl',
  token_endpoint_empty: 'tokenEndpoint boş bolmaly däl',
  redirect_uri_empty: 'redirectUri boş bolmaly däl',
  missing_code_or_state: 'code ýa-da state ýok',
  invalid_state: 'Nädogry ýa-da möhleti geçen state',
  authorization_denied: 'Ygtyýarnama ret edildi: {{error}}',
  token_exchange_failed: 'access_token çalyşmak şowsuz',
  token_type_invalid: 'Token jogabyndaky token_type nädogry ýa-da goldanylmaýar',
  refresh_token_empty: 'refreshToken boş bolmaly däl',
  token_refresh_failed: 'access_token täzelemek şowsuz',
  revoke_token_empty: 'token boş bolmaly däl',
  revocation_endpoint_empty: 'revocationEndpoint düzülenok we discovery üpjün etmedi',
  token_revoke_failed: 'Tokini ýatyrmak şowsuz',
  oidc_issuer_empty: 'oidc.issuer boş bolmaly däl',
  oidc_discovery_failed: 'OIDC discovery şowsuz',
  oidc_issuer_mismatch:
    'OIDC discovery tarapyndan yzyna gaýtarylan issuer düzüliş bilen gabat gelmeýär',
  oidc_jwks_uri_missing: 'jwks_uri ýok',
  oidc_missing_id_token: 'Token jogabynda id_token ýok',
  oidc_id_token_invalid: 'id_token barlagy şowsuz',
  oidc_nonce_mismatch: 'id_token nonce gabat gelmeýär',
  oidc_at_hash_mismatch: 'id_token at_hash access_token bilen gabat gelmeýär',
  oidc_azp_mismatch: 'id_token azp barlagy şowsuz',
  callback_iss_mismatch:
    'Ygtyýarnama yzyna çagyryşyndaky iss düzüliş bilen gabat gelmeýär',
  callback_unsupported_response:
    'Ygtyýarnama yzyna çagyryşy goldanylmaýan implicit/hybrid akym parametrlerini öz içine alýar',
});
