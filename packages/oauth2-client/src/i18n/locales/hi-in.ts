import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl धनात्मक अवधि होनी चाहिए',
  client_id_empty: 'clientId खाली नहीं हो सकता',
  client_secret_empty: 'clientSecret खाली नहीं हो सकता',
  authorization_endpoint_empty: 'authorizationEndpoint खाली नहीं हो सकता',
  token_endpoint_empty: 'tokenEndpoint खाली नहीं हो सकता',
  redirect_uri_empty: 'redirectUri खाली नहीं हो सकता',
  missing_code_or_state: 'code या state अनुपस्थित है',
  invalid_state: 'अमान्य या समाप्त state',
  authorization_denied: 'अनुमति अस्वीकृत: {{error}}',
  token_exchange_failed: 'access_token विनिमय विफल',
  token_type_invalid: 'टोकन प्रतिक्रिया का token_type अमान्य या असमर्थित है',
  refresh_token_empty: 'refreshToken खाली नहीं हो सकता',
  token_refresh_failed: 'access_token ताज़ा करना विफल',
  revoke_token_empty: 'token खाली नहीं हो सकता',
  revocation_endpoint_empty:
    'revocationEndpoint कॉन्फ़िगर नहीं है और discovery ने प्रदान नहीं किया',
  token_revoke_failed: 'टोकन निरस्त करना विफल',
  oidc_issuer_empty: 'oidc.issuer खाली नहीं हो सकता',
  oidc_discovery_failed: 'OIDC discovery विफल',
  oidc_issuer_mismatch: 'OIDC discovery द्वारा लौटाया गया issuer कॉन्फ़िगरेशन से मेल नहीं खाता',
  oidc_jwks_uri_missing: 'jwks_uri अनुपस्थित है',
  oidc_missing_id_token: 'टोकन प्रतिक्रिया में id_token नहीं है',
  oidc_id_token_invalid: 'id_token सत्यापन विफल',
  oidc_nonce_mismatch: 'id_token nonce मेल नहीं खाता',
  oidc_at_hash_mismatch: 'id_token at_hash, access_token से मेल नहीं खाता',
  oidc_azp_mismatch: 'id_token azp सत्यापन विफल',
  callback_iss_mismatch: 'अनुमति कॉलबैक का iss कॉन्फ़िगरेशन से मेल नहीं खाता',
  callback_unsupported_response: 'अनुमति कॉलबैक में असमर्थित अंतर्निहित/हाइब्रिड प्रवाह पैरामीटर हैं',
});
