import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl peab olema positiivne kestus',
  client_id_empty: 'clientId ei tohi olla tühi',
  client_secret_empty: 'clientSecret ei tohi olla tühi',
  authorization_endpoint_empty: 'authorizationEndpoint ei tohi olla tühi',
  token_endpoint_empty: 'tokenEndpoint ei tohi olla tühi',
  redirect_uri_empty: 'redirectUri ei tohi olla tühi',
  missing_code_or_state: 'Puudub code või state',
  invalid_state: 'Kehtetu või aegunud state',
  authorization_denied: 'Autoriseerimine keelatud: {{error}}',
  token_exchange_failed: 'access_token vahetamine ebaõnnestus',
  token_type_invalid: 'Vastuse token_type on kehtetu või toetamata',
  refresh_token_empty: 'refreshToken ei tohi olla tühi',
  token_refresh_failed: 'access_token värskendamine ebaõnnestus',
  revoke_token_empty: 'token ei tohi olla tühi',
  revocation_endpoint_empty:
    'revocationEndpoint pole seadistatud ja discovery ei esitanud seda',
  token_revoke_failed: 'Luba tühistamine ebaõnnestus',
  oidc_issuer_empty: 'oidc.issuer ei tohi olla tühi',
  oidc_discovery_failed: 'OIDC discovery ebaõnnestus',
  oidc_issuer_mismatch: 'OIDC discovery tagastatud issuer ei ühti seadistusega',
  oidc_jwks_uri_missing: 'Puudub jwks_uri',
  oidc_missing_id_token: 'Vastuses puudub id_token',
  oidc_id_token_invalid: 'id_token kontroll ebaõnnestus',
  oidc_nonce_mismatch: 'id_token nonce ei ühti',
  oidc_at_hash_mismatch: 'id_token at_hash ei ühti access_tokeniga',
  oidc_azp_mismatch: 'id_token azp kontroll ebaõnnestus',
  callback_iss_mismatch: 'Autoriseerimise tagasihelistuse iss ei ühti seadistusega',
  callback_unsupported_response:
    'Autoriseerimise tagasihelistus sisaldab toetamata implicit/hybrid voo parameetreid',
});
