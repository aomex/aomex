import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl უნდა იყოს დადებითი ხანგრძლივობა',
  client_id_empty: 'clientId არ უნდა იყოს ცარიელი',
  client_secret_empty: 'clientSecret არ უნდა იყოს ცარიელი',
  authorization_endpoint_empty: 'authorizationEndpoint არ უნდა იყოს ცარიელი',
  token_endpoint_empty: 'tokenEndpoint არ უნდა იყოს ცარიელი',
  redirect_uri_empty: 'redirectUri არ უნდა იყოს ცარიელი',
  missing_code_or_state: 'აკლია code ან state',
  invalid_state: 'არასწორი ან ვადაგასული state',
  authorization_denied: 'ავტორიზაცია უარყოფილია: {{error}}',
  token_exchange_failed: 'access_token-ის გაცვლა ვერ მოხერხდა',
  token_type_invalid: 'პასუხის token_type არასწორია ან არ არის მხარდაჭერილი',
  refresh_token_empty: 'refreshToken არ უნდა იყოს ცარიელი',
  token_refresh_failed: 'access_token-ის განახლება ვერ მოხერხდა',
  revoke_token_empty: 'token არ უნდა იყოს ცარიელი',
  revocation_endpoint_empty:
    'revocationEndpoint არ არის კონფიგურირებული და discovery არ მოგვაწოდა',
  token_revoke_failed: 'ტოკენის გაუქმება ვერ მოხერხდა',
  oidc_issuer_empty: 'oidc.issuer არ უნდა იყოს ცარიელი',
  oidc_discovery_failed: 'OIDC discovery ვერ მოხერხდა',
  oidc_issuer_mismatch: 'OIDC discovery-ის დაბრუნებული issuer არ ემთხვევა კონფიგურაციას',
  oidc_jwks_uri_missing: 'აკლია jwks_uri',
  oidc_missing_id_token: 'პასუხში აკლია id_token',
  oidc_id_token_invalid: 'id_token-ის შემოწმება ვერ მოხერხდა',
  oidc_nonce_mismatch: 'id_token-ის nonce არ ემთხვევა',
  oidc_at_hash_mismatch: 'id_token-ის at_hash არ ემთხვევა access_token-ს',
  oidc_azp_mismatch: 'id_token-ის azp შემოწმება ვერ მოხერხდა',
  callback_iss_mismatch: 'ავტორიზაციის უკუძახების iss არ ემთხვევა კონფიგურაციას',
  callback_unsupported_response:
    'ავტორიზაციის უკუძახება შეიცავს მხარდაუჭერელ implicit/hybrid ნაკადის პარამეტრებს',
});
