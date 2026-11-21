import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl অবশ্যই ধনাত্মক সময়কাল হতে হবে',
  client_id_empty: 'clientId খালি হতে পারে না',
  client_secret_empty: 'clientSecret খালি হতে পারে না',
  authorization_endpoint_empty: 'authorizationEndpoint খালি হতে পারে না',
  token_endpoint_empty: 'tokenEndpoint খালি হতে পারে না',
  redirect_uri_empty: 'redirectUri খালি হতে পারে না',
  missing_code_or_state: 'code বা state অনুপস্থিত',
  invalid_state: 'অবৈধ বা মেয়াদোত্তীর্ণ state',
  authorization_denied: 'অনুমোদন প্রত্যাখ্যান: {{error}}',
  token_exchange_failed: 'access_token বিনিময় ব্যর্থ',
  token_type_invalid: 'টোকেন প্রতিক্রিয়ার token_type অবৈধ বা অসমর্থিত',
  refresh_token_empty: 'refreshToken খালি হতে পারে না',
  token_refresh_failed: 'access_token সতেজকরণ ব্যর্থ',
  revoke_token_empty: 'token খালি হতে পারে না',
  revocation_endpoint_empty:
    'revocationEndpoint কনফিগার করা নেই এবং discovery প্রদান করেনি',
  token_revoke_failed: 'টোকেন বাতিলকরণ ব্যর্থ',
  oidc_issuer_empty: 'oidc.issuer খালি হতে পারে না',
  oidc_discovery_failed: 'OIDC discovery ব্যর্থ',
  oidc_issuer_mismatch: 'OIDC discovery-এর ফেরত issuer কনফিগারেশনের সাথে মেলে না',
  oidc_jwks_uri_missing: 'jwks_uri অনুপস্থিত',
  oidc_missing_id_token: 'টোকেন প্রতিক্রিয়ায় id_token নেই',
  oidc_id_token_invalid: 'id_token যাচাইকরণ ব্যর্থ',
  oidc_nonce_mismatch: 'id_token nonce মেলে না',
  oidc_at_hash_mismatch: 'id_token at_hash, access_token-এর সাথে মেলে না',
  oidc_azp_mismatch: 'id_token azp যাচাইকরণ ব্যর্থ',
  callback_iss_mismatch: 'অনুমোদন কলব্যাকের iss কনফিগারেশনের সাথে মেলে না',
  callback_unsupported_response:
    'অনুমোদন কলব্যাকে অসমর্থিত অন্তর্নিহিত/হাইব্রিড প্রবাহ প্যারামিটার আছে',
});
