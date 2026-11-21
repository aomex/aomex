import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl धनात्मक अवधि हुनुपर्छ',
  client_id_empty: 'clientId खाली हुन सक्दैन',
  client_secret_empty: 'clientSecret खाली हुन सक्दैन',
  authorization_endpoint_empty: 'authorizationEndpoint खाली हुन सक्दैन',
  token_endpoint_empty: 'tokenEndpoint खाली हुन सक्दैन',
  redirect_uri_empty: 'redirectUri खाली हुन सक्दैन',
  missing_code_or_state: 'code वा state छैन',
  invalid_state: 'अमान्य वा म्याद सकिएको state',
  authorization_denied: 'अधिकार अस्वीकृत: {{error}}',
  token_exchange_failed: 'access_token साट्न असफल',
  token_type_invalid: 'टोकन प्रतिक्रियाको token_type अमान्य वा असमर्थित छ',
  refresh_token_empty: 'refreshToken खाली हुन सक्दैन',
  token_refresh_failed: 'access_token ताजा गर्न असफल',
  revoke_token_empty: 'token खाली हुन सक्दैन',
  revocation_endpoint_empty:
    'revocationEndpoint कन्फिगर गरिएको छैन र discovery ले प्रदान गरेन',
  token_revoke_failed: 'टोकन रद्द गर्न असफल',
  oidc_issuer_empty: 'oidc.issuer खाली हुन सक्दैन',
  oidc_discovery_failed: 'OIDC discovery असफल',
  oidc_issuer_mismatch: 'OIDC discovery ले फर्काएको issuer कन्फिगरेसनसँग मिल्दैन',
  oidc_jwks_uri_missing: 'jwks_uri छैन',
  oidc_missing_id_token: 'टोकन प्रतिक्रियामा id_token छैन',
  oidc_id_token_invalid: 'id_token प्रमाणीकरण असफल',
  oidc_nonce_mismatch: 'id_token को nonce मिल्दैन',
  oidc_at_hash_mismatch: 'id_token को at_hash access_token सँग मिल्दैन',
  oidc_azp_mismatch: 'id_token को azp प्रमाणीकरण असफल',
  callback_iss_mismatch: 'अधिकार कलब्याकको iss कन्फिगरेसनसँग मिल्दैन',
  callback_unsupported_response:
    'अधिकार कलब्याकमा असमर्थित निहित/हाइब्रिड प्रवाह प्यारामिटरहरू छन्',
});
