import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl jābūt pozitīvam ilgumam',
  client_id_empty: 'clientId nedrīkst būt tukšs',
  client_secret_empty: 'clientSecret nedrīkst būt tukšs',
  authorization_endpoint_empty: 'authorizationEndpoint nedrīkst būt tukšs',
  token_endpoint_empty: 'tokenEndpoint nedrīkst būt tukšs',
  redirect_uri_empty: 'redirectUri nedrīkst būt tukšs',
  missing_code_or_state: 'Trūkst code vai state',
  invalid_state: 'Nederīgs vai beidzies state',
  authorization_denied: 'Autorizācija noraidīta: {{error}}',
  token_exchange_failed: 'Neizdevās apmainīt access_token',
  token_type_invalid: 'Atbildes token_type ir nederīgs vai netiek atbalstīts',
  refresh_token_empty: 'refreshToken nedrīkst būt tukšs',
  token_refresh_failed: 'Neizdevās atsvaidzināt access_token',
  revoke_token_empty: 'token nedrīkst būt tukšs',
  revocation_endpoint_empty:
    'revocationEndpoint nav konfigurēts, un discovery to nesniedza',
  token_revoke_failed: 'Neizdevās atsaukt žetonu',
  oidc_issuer_empty: 'oidc.issuer nedrīkst būt tukšs',
  oidc_discovery_failed: 'OIDC discovery neizdevās',
  oidc_issuer_mismatch: 'OIDC discovery atgrieztais issuer nesakrīt ar konfigurāciju',
  oidc_jwks_uri_missing: 'Trūkst jwks_uri',
  oidc_missing_id_token: 'Atbildē nav id_token',
  oidc_id_token_invalid: 'id_token pārbaude neizdevās',
  oidc_nonce_mismatch: 'id_token nonce nesakrīt',
  oidc_at_hash_mismatch: 'id_token at_hash nesakrīt ar access_token',
  oidc_azp_mismatch: 'id_token azp pārbaude neizdevās',
  callback_iss_mismatch: 'Autorizācijas atzvana iss nesakrīt ar konfigurāciju',
  callback_unsupported_response:
    'Autorizācijas atzvans satur neatbalstītus implicit/hybrid plūsmas parametrus',
});
