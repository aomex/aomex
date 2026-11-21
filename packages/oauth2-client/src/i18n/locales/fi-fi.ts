import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl:n on oltava positiivinen kesto',
  client_id_empty: 'clientId ei saa olla tyhjä',
  client_secret_empty: 'clientSecret ei saa olla tyhjä',
  authorization_endpoint_empty: 'authorizationEndpoint ei saa olla tyhjä',
  token_endpoint_empty: 'tokenEndpoint ei saa olla tyhjä',
  redirect_uri_empty: 'redirectUri ei saa olla tyhjä',
  missing_code_or_state: 'code tai state puuttuu',
  invalid_state: 'Virheellinen tai vanhentunut state',
  authorization_denied: 'Valtuutus hylätty: {{error}}',
  token_exchange_failed: 'access_token-vaihto epäonnistui',
  token_type_invalid: 'Token-vastauksen token_type on virheellinen tai sitä ei tueta',
  refresh_token_empty: 'refreshToken ei saa olla tyhjä',
  token_refresh_failed: 'access_token-päivitys epäonnistui',
  revoke_token_empty: 'token ei saa olla tyhjä',
  revocation_endpoint_empty:
    'revocationEndpoint ei ole määritetty eikä discovery tarjonnut sitä',
  token_revoke_failed: 'Tokenin peruutus epäonnistui',
  oidc_issuer_empty: 'oidc.issuer ei saa olla tyhjä',
  oidc_discovery_failed: 'OIDC discovery epäonnistui',
  oidc_issuer_mismatch: 'OIDC discoveryn palauttama issuer ei vastaa määritystä',
  oidc_jwks_uri_missing: 'jwks_uri puuttuu',
  oidc_missing_id_token: 'Token-vastauksesta puuttuu id_token',
  oidc_id_token_invalid: 'id_token-varmistus epäonnistui',
  oidc_nonce_mismatch: 'id_tokenin nonce ei täsmää',
  oidc_at_hash_mismatch: 'id_tokenin at_hash ei täsmää access_tokeniin',
  oidc_azp_mismatch: 'id_tokenin azp-varmistus epäonnistui',
  callback_iss_mismatch: 'Valtuutuspalautteen iss ei vastaa määritystä',
  callback_unsupported_response:
    'Valtuutuspalaute sisältää tukemattomia implisiittisen/hybridivirran parametreja',
});
