import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl ධන කාල සීමාවක් විය යුතුය',
  client_id_empty: 'clientId හිස් විය නොහැක',
  client_secret_empty: 'clientSecret හිස් විය නොහැක',
  authorization_endpoint_empty: 'authorizationEndpoint හිස් විය නොහැක',
  token_endpoint_empty: 'tokenEndpoint හිස් විය නොහැක',
  redirect_uri_empty: 'redirectUri හිස් විය නොහැක',
  missing_code_or_state: 'code හෝ state නැත',
  invalid_state: 'වලංගු නොවන හෝ කල් ඉකුත් වූ state',
  authorization_denied: 'අවසරය ප්‍රතික්ෂේප විය: {{error}}',
  token_exchange_failed: 'access_token හුවමාරුව අසාර්ථක විය',
  token_type_invalid: 'ටෝකන් ප්‍රතිචාරයේ token_type වලංගු නැත හෝ සහාය නොදක්වයි',
  refresh_token_empty: 'refreshToken හිස් විය නොහැක',
  token_refresh_failed: 'access_token යාවත්කාලීන කිරීම අසාර්ථක විය',
  revoke_token_empty: 'token හිස් විය නොහැක',
  revocation_endpoint_empty: 'revocationEndpoint වින්‍යාස කර නැති අතර discovery සපයා නැත',
  token_revoke_failed: 'ටෝකනය අවලංගු කිරීම අසාර්ථක විය',
  oidc_issuer_empty: 'oidc.issuer හිස් විය නොහැක',
  oidc_discovery_failed: 'OIDC discovery අසාර්ථක විය',
  oidc_issuer_mismatch: 'OIDC discovery ආපසු දුන් issuer වින්‍යාසය සමඟ නොගැලපේ',
  oidc_jwks_uri_missing: 'jwks_uri නැත',
  oidc_missing_id_token: 'ටෝකන් ප්‍රතිචාරයේ id_token නැත',
  oidc_id_token_invalid: 'id_token සත්‍යාපනය අසාර්ථක විය',
  oidc_nonce_mismatch: 'id_token හි nonce නොගැලපේ',
  oidc_at_hash_mismatch: 'id_token හි at_hash access_token සමඟ නොගැලපේ',
  oidc_azp_mismatch: 'id_token හි azp සත්‍යාපනය අසාර්ථක විය',
  callback_iss_mismatch: 'අවසර ප්‍රතිචාරයේ iss වින්‍යාසය සමඟ නොගැලපේ',
  callback_unsupported_response:
    'අවසර ප්‍රතිචාරයේ සහාය නොදක්වන implicit/hybrid ප්‍රවාහ පරාමිති අඩංගුය',
});
