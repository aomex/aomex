import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl ധനാത്മക ദൈർഘ്യമായിരിക്കണം',
  client_id_empty: 'clientId ശൂന്യമായിരിക്കരുത്',
  client_secret_empty: 'clientSecret ശൂന്യമായിരിക്കരുത്',
  authorization_endpoint_empty: 'authorizationEndpoint ശൂന്യമായിരിക്കരുത്',
  token_endpoint_empty: 'tokenEndpoint ശൂന്യമായിരിക്കരുത്',
  redirect_uri_empty: 'redirectUri ശൂന്യമായിരിക്കരുത്',
  missing_code_or_state: 'code അല്ലെങ്കിൽ state ഇല്ല',
  invalid_state: 'അസാധുവായ അല്ലെങ്കിൽ കാലഹരണപ്പെട്ട state',
  authorization_denied: 'അനുമതി നിരസിച്ചു: {{error}}',
  token_exchange_failed: 'access_token കൈമാറ്റം പരാജയപ്പെട്ടു',
  token_type_invalid: 'ടോക്കൺ പ്രതികരണത്തിലെ token_type അസാധുവാണ് അല്ലെങ്കിൽ പിന്തുണയ്ക്കുന്നില്ല',
  refresh_token_empty: 'refreshToken ശൂന്യമായിരിക്കരുത്',
  token_refresh_failed: 'access_token പുതുക്കൽ പരാജയപ്പെട്ടു',
  revoke_token_empty: 'token ശൂന്യമായിരിക്കരുത്',
  revocation_endpoint_empty: 'revocationEndpoint ക്രമീകരിച്ചിട്ടില്ല, discovery നൽകിയിട്ടുമില്ല',
  token_revoke_failed: 'ടോക്കൺ റദ്ദാക്കൽ പരാജയപ്പെട്ടു',
  oidc_issuer_empty: 'oidc.issuer ശൂന്യമായിരിക്കരുത്',
  oidc_discovery_failed: 'OIDC discovery പരാജയപ്പെട്ടു',
  oidc_issuer_mismatch: 'OIDC discovery തിരിച്ചയച്ച issuer ക്രമീകരണവുമായി പൊരുത്തപ്പെടുന്നില്ല',
  oidc_jwks_uri_missing: 'jwks_uri ഇല്ല',
  oidc_missing_id_token: 'ടോക്കൺ പ്രതികരണത്തിൽ id_token ഇല്ല',
  oidc_id_token_invalid: 'id_token പരിശോധന പരാജയപ്പെട്ടു',
  oidc_nonce_mismatch: 'id_token nonce പൊരുത്തപ്പെടുന്നില്ല',
  oidc_at_hash_mismatch: 'id_token at_hash, access_token-മായി പൊരുത്തപ്പെടുന്നില്ല',
  oidc_azp_mismatch: 'id_token azp പരിശോധന പരാജയപ്പെട്ടു',
  callback_iss_mismatch: 'അനുമതി കോൾബാക്കിലെ iss ക്രമീകരണവുമായി പൊരുത്തപ്പെടുന്നില്ല',
  callback_unsupported_response:
    'അനുമതി കോൾബാക്കിൽ പിന്തുണയ്ക്കാത്ത implicit/hybrid ഒഴുക്ക് പാരാമീറ്ററുകളുണ്ട്',
});
