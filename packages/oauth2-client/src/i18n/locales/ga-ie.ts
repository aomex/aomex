import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'Ní mór do stateTtl a bheith ina fhad dearfach',
  client_id_empty: 'Ní féidir le clientId a bheith folamh',
  client_secret_empty: 'Ní féidir le clientSecret a bheith folamh',
  authorization_endpoint_empty: 'Ní féidir le authorizationEndpoint a bheith folamh',
  token_endpoint_empty: 'Ní féidir le tokenEndpoint a bheith folamh',
  redirect_uri_empty: 'Ní féidir le redirectUri a bheith folamh',
  missing_code_or_state: 'Tá code nó state in easnamh',
  invalid_state: 'state neamhbhailí nó in éag',
  authorization_denied: 'Údarú diúltaithe: {{error}}',
  token_exchange_failed: 'Theip ar malartú access_token',
  token_type_invalid: 'Tá token_type sa fhreagra neamhbhailí nó gan tacaíocht',
  refresh_token_empty: 'Ní féidir le refreshToken a bheith folamh',
  token_refresh_failed: 'Theip ar athnuachan access_token',
  revoke_token_empty: 'Ní féidir le token a bheith folamh',
  revocation_endpoint_empty:
    'Níl revocationEndpoint cumraithe agus níor sholáthair discovery é',
  token_revoke_failed: 'Theip ar chúlghairm an chomhartha',
  oidc_issuer_empty: 'Ní féidir le oidc.issuer a bheith folamh',
  oidc_discovery_failed: 'Theip ar OIDC discovery',
  oidc_issuer_mismatch: 'Ní mheaitseálann an issuer ó OIDC discovery leis an gcumraíocht',
  oidc_jwks_uri_missing: 'Tá jwks_uri in easnamh',
  oidc_missing_id_token: 'Tá id_token in easnamh ón bhfreagra',
  oidc_id_token_invalid: 'Theip ar fhíorú id_token',
  oidc_nonce_mismatch: 'Ní mheaitseálann nonce id_token',
  oidc_at_hash_mismatch: 'Ní mheaitseálann at_hash id_token le access_token',
  oidc_azp_mismatch: 'Theip ar fhíorú azp id_token',
  callback_iss_mismatch: 'Ní mheaitseálann iss an aischuir údaraithe leis an gcumraíocht',
  callback_unsupported_response:
    'Tá paraiméadair sreafa intuigthe/hibrideacha gan tacaíocht san aischur údaraithe',
});
