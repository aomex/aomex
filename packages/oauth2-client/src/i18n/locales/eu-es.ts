import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl iraupen positiboa izan behar da',
  client_id_empty: 'clientId ezin da hutsik egon',
  client_secret_empty: 'clientSecret ezin da hutsik egon',
  authorization_endpoint_empty: 'authorizationEndpoint ezin da hutsik egon',
  token_endpoint_empty: 'tokenEndpoint ezin da hutsik egon',
  redirect_uri_empty: 'redirectUri ezin da hutsik egon',
  missing_code_or_state: 'code edo state falta da',
  invalid_state: 'state baliogabea edo iraungita',
  authorization_denied: 'Baimena ukatuta: {{error}}',
  token_exchange_failed: 'access_token trukatzeak huts egin du',
  token_type_invalid: 'Erantzuneko token_type baliogabea da edo ez da onartzen',
  refresh_token_empty: 'refreshToken ezin da hutsik egon',
  token_refresh_failed: 'access_token freskatzeak huts egin du',
  revoke_token_empty: 'token ezin da hutsik egon',
  revocation_endpoint_empty:
    'revocationEndpoint ez dago konfiguratuta eta discovery-k ez du eman',
  token_revoke_failed: 'Tokena baliogabetzeak huts egin du',
  oidc_issuer_empty: 'oidc.issuer ezin da hutsik egon',
  oidc_discovery_failed: 'OIDC discovery-k huts egin du',
  oidc_issuer_mismatch:
    'OIDC discovery-k itzulitako issuer-a ez dator bat konfigurazioarekin',
  oidc_jwks_uri_missing: 'jwks_uri falta da',
  oidc_missing_id_token: 'Erantzunak ez du id_token',
  oidc_id_token_invalid: 'id_token egiaztatzeak huts egin du',
  oidc_nonce_mismatch: 'id_token-en nonce-a ez dator bat',
  oidc_at_hash_mismatch: 'id_token-en at_hash ez dator bat access_token-ekin',
  oidc_azp_mismatch: 'id_token-en azp egiaztatzeak huts egin du',
  callback_iss_mismatch: 'Baimenaren atzera-deiaren iss ez dator bat konfigurazioarekin',
  callback_unsupported_response:
    'Baimenaren atzera-deiak onartzen ez diren implicit/hybrid fluxu-parametroak ditu',
});
