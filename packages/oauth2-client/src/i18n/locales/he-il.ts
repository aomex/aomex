import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl חייב להיות משך חיובי',
  client_id_empty: 'clientId לא יכול להיות ריק',
  client_secret_empty: 'clientSecret לא יכול להיות ריק',
  authorization_endpoint_empty: 'authorizationEndpoint לא יכול להיות ריק',
  token_endpoint_empty: 'tokenEndpoint לא יכול להיות ריק',
  redirect_uri_empty: 'redirectUri לא יכול להיות ריק',
  missing_code_or_state: 'חסר code או state',
  invalid_state: 'state לא תקין או שפג תוקפו',
  authorization_denied: 'ההרשאה נדחתה: {{error}}',
  token_exchange_failed: 'החלפת access_token נכשלה',
  token_type_invalid: 'token_type בתגובת האסימון אינו תקין או אינו נתמך',
  refresh_token_empty: 'refreshToken לא יכול להיות ריק',
  token_refresh_failed: 'רענון access_token נכשל',
  revoke_token_empty: 'token לא יכול להיות ריק',
  revocation_endpoint_empty: 'revocationEndpoint אינו מוגדר ו-discovery לא סיפק אותו',
  token_revoke_failed: 'ביטול האסימון נכשל',
  oidc_issuer_empty: 'oidc.issuer לא יכול להיות ריק',
  oidc_discovery_failed: 'OIDC discovery נכשל',
  oidc_issuer_mismatch: 'ה-issuer שחזר מ-OIDC discovery אינו תואם להגדרה',
  oidc_jwks_uri_missing: 'חסר jwks_uri',
  oidc_missing_id_token: 'תגובת האסימון חסרה id_token',
  oidc_id_token_invalid: 'אימות id_token נכשל',
  oidc_nonce_mismatch: 'nonce של id_token אינו תואם',
  oidc_at_hash_mismatch: 'at_hash של id_token אינו תואם ל-access_token',
  oidc_azp_mismatch: 'אימות azp של id_token נכשל',
  callback_iss_mismatch: 'iss בקריאת החזרה של ההרשאה אינו תואם להגדרה',
  callback_unsupported_response:
    'קריאת החזרה של ההרשאה מכילה פרמטרי זרימה מרומזת/היברידית שאינם נתמכים',
});
