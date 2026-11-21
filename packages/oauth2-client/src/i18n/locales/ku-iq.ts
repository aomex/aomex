import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl دەبێت ماوەیەکی ئەرێنی بێت',
  client_id_empty: 'clientId نابێت بەتاڵ بێت',
  client_secret_empty: 'clientSecret نابێت بەتاڵ بێت',
  authorization_endpoint_empty: 'authorizationEndpoint نابێت بەتاڵ بێت',
  token_endpoint_empty: 'tokenEndpoint نابێت بەتاڵ بێت',
  redirect_uri_empty: 'redirectUri نابێت بەتاڵ بێت',
  missing_code_or_state: 'code یان state دیار نییە',
  invalid_state: 'state نادروست یان بەسەرچوو',
  authorization_denied: 'ڕێپێدان ڕەتکرایەوە: {{error}}',
  token_exchange_failed: 'گۆڕینی access_token سەرکەوتوو نەبوو',
  token_type_invalid: 'token_type لە وەڵامی تۆکێن نادروستە یان پشتگیری ناکرێت',
  refresh_token_empty: 'refreshToken نابێت بەتاڵ بێت',
  token_refresh_failed: 'نوێکردنەوەی access_token سەرکەوتوو نەبوو',
  revoke_token_empty: 'token نابێت بەتاڵ بێت',
  revocation_endpoint_empty:
    'revocationEndpoint ڕێکخراو نییە و discovery دابینی نەکردووە',
  token_revoke_failed: 'هەڵوەشاندنەوەی تۆکێن سەرکەوتوو نەبوو',
  oidc_issuer_empty: 'oidc.issuer نابێت بەتاڵ بێت',
  oidc_discovery_failed: 'OIDC discovery سەرکەوتوو نەبوو',
  oidc_issuer_mismatch: 'issuer کە OIDC discovery گەڕاندەوە لەگەڵ ڕێکخستن یەک ناگرێتەوە',
  oidc_jwks_uri_missing: 'jwks_uri دیار نییە',
  oidc_missing_id_token: 'وەڵامی تۆکێن id_token ی تێدا نییە',
  oidc_id_token_invalid: 'پشتڕاستکردنەوەی id_token سەرکەوتوو نەبوو',
  oidc_nonce_mismatch: 'nonce ی id_token یەک ناگرێتەوە',
  oidc_at_hash_mismatch: 'at_hash ی id_token لەگەڵ access_token یەک ناگرێتەوە',
  oidc_azp_mismatch: 'پشتڕاستکردنەوەی azp ی id_token سەرکەوتوو نەبوو',
  callback_iss_mismatch: 'iss ی پەیوەندی گەڕانەوەی ڕێپێدان لەگەڵ ڕێکخستن یەک ناگرێتەوە',
  callback_unsupported_response:
    'پەیوەندی گەڕانەوەی ڕێپێدان پارامەتری implicit/hybrid ی پشتگیرینەکراوی تێدایە',
});
