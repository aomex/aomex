import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl धन कालावधी असणे आवश्यक आहे',
  client_id_empty: 'clientId रिक्त असू शकत नाही',
  client_secret_empty: 'clientSecret रिक्त असू शकत नाही',
  authorization_endpoint_empty: 'authorizationEndpoint रिक्त असू शकत नाही',
  token_endpoint_empty: 'tokenEndpoint रिक्त असू शकत नाही',
  redirect_uri_empty: 'redirectUri रिक्त असू शकत नाही',
  missing_code_or_state: 'code किंवा state नाही',
  invalid_state: 'अवैध किंवा कालबाह्य state',
  authorization_denied: 'अधिकृतता नाकारली: {{error}}',
  token_exchange_failed: 'access_token देवाणघेवाण अयशस्वी',
  token_type_invalid: 'टोकन प्रतिसादातील token_type अवैध किंवा असमर्थित आहे',
  refresh_token_empty: 'refreshToken रिक्त असू शकत नाही',
  token_refresh_failed: 'access_token रीफ्रेश अयशस्वी',
  revoke_token_empty: 'token रिक्त असू शकत नाही',
  revocation_endpoint_empty:
    'revocationEndpoint कॉन्फिगर केलेले नाही आणि discovery ने दिले नाही',
  token_revoke_failed: 'टोकन रद्द करणे अयशस्वी',
  oidc_issuer_empty: 'oidc.issuer रिक्त असू शकत नाही',
  oidc_discovery_failed: 'OIDC discovery अयशस्वी',
  oidc_issuer_mismatch: 'OIDC discovery ने परत केलेला issuer कॉन्फिगरेशनशी जुळत नाही',
  oidc_jwks_uri_missing: 'jwks_uri नाही',
  oidc_missing_id_token: 'टोकन प्रतिसादात id_token नाही',
  oidc_id_token_invalid: 'id_token पडताळणी अयशस्वी',
  oidc_nonce_mismatch: 'id_token nonce जुळत नाही',
  oidc_at_hash_mismatch: 'id_token at_hash, access_token शी जुळत नाही',
  oidc_azp_mismatch: 'id_token azp पडताळणी अयशस्वी',
  callback_iss_mismatch: 'अधिकृतता कॉलबॅकचा iss कॉन्फिगरेशनशी जुळत नाही',
  callback_unsupported_response:
    'अधिकृतता कॉलबॅकमध्ये असमर्थित अंतर्निहित/हायब्रिड प्रवाह पॅरामीटर्स आहेत',
});
