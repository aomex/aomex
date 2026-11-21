import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl mora biti pozitivno trajanje',
  client_id_empty: 'clientId ne sme biti prazan',
  client_secret_empty: 'clientSecret ne sme biti prazan',
  authorization_endpoint_empty: 'authorizationEndpoint ne sme biti prazan',
  token_endpoint_empty: 'tokenEndpoint ne sme biti prazan',
  redirect_uri_empty: 'redirectUri ne sme biti prazan',
  missing_code_or_state: 'Nedostaje code ili state',
  invalid_state: 'Nevažeći ili istekli state',
  authorization_denied: 'Autorizacija odbijena: {{error}}',
  token_exchange_failed: 'Zamena access_token nije uspela',
  token_type_invalid: 'token_type u odgovoru tokena je nevažeći ili nije podržan',
  refresh_token_empty: 'refreshToken ne sme biti prazan',
  token_refresh_failed: 'Osvežavanje access_token nije uspelo',
  revoke_token_empty: 'token ne sme biti prazan',
  revocation_endpoint_empty:
    'revocationEndpoint nije konfigurisan i discovery ga nije pružio',
  token_revoke_failed: 'Opoziv tokena nije uspeo',
  oidc_issuer_empty: 'oidc.issuer ne sme biti prazan',
  oidc_discovery_failed: 'OIDC discovery nije uspeo',
  oidc_issuer_mismatch: 'issuer koji je vratio OIDC discovery ne odgovara konfiguraciji',
  oidc_jwks_uri_missing: 'Nedostaje jwks_uri',
  oidc_missing_id_token: 'Odgovor tokena ne sadrži id_token',
  oidc_id_token_invalid: 'Provera id_token nije uspela',
  oidc_nonce_mismatch: 'nonce u id_token se ne podudara',
  oidc_at_hash_mismatch: 'at_hash u id_token se ne podudara sa access_token',
  oidc_azp_mismatch: 'Provera azp u id_token nije uspela',
  callback_iss_mismatch: 'iss u povratnom pozivu autorizacije ne odgovara konfiguraciji',
  callback_unsupported_response:
    'Povratni poziv autorizacije sadrži nepodržane parametre implicitnog/hibridnog toka',
});
