import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl mora biti pozitivno trajanje',
  client_id_empty: 'clientId ne smije biti prazan',
  client_secret_empty: 'clientSecret ne smije biti prazan',
  authorization_endpoint_empty: 'authorizationEndpoint ne smije biti prazan',
  token_endpoint_empty: 'tokenEndpoint ne smije biti prazan',
  redirect_uri_empty: 'redirectUri ne smije biti prazan',
  missing_code_or_state: 'Nedostaje code ili state',
  invalid_state: 'Nevažeći ili istekli state',
  authorization_denied: 'Autorizacija odbijena: {{error}}',
  token_exchange_failed: 'Zamjena access_token nije uspjela',
  token_type_invalid: 'token_type u odgovoru tokena je nevažeći ili nije podržan',
  refresh_token_empty: 'refreshToken ne smije biti prazan',
  token_refresh_failed: 'Osvježavanje access_token nije uspjelo',
  revoke_token_empty: 'token ne smije biti prazan',
  revocation_endpoint_empty:
    'revocationEndpoint nije konfiguriran i discovery ga nije pružio',
  token_revoke_failed: 'Opoziv tokena nije uspio',
  oidc_issuer_empty: 'oidc.issuer ne smije biti prazan',
  oidc_discovery_failed: 'OIDC discovery nije uspio',
  oidc_issuer_mismatch: 'issuer koji je vratio OIDC discovery ne odgovara konfiguraciji',
  oidc_jwks_uri_missing: 'Nedostaje jwks_uri',
  oidc_missing_id_token: 'Odgovor tokena ne sadrži id_token',
  oidc_id_token_invalid: 'Provjera id_token nije uspjela',
  oidc_nonce_mismatch: 'nonce u id_token se ne podudara',
  oidc_at_hash_mismatch: 'at_hash u id_token se ne podudara s access_token',
  oidc_azp_mismatch: 'Provjera azp u id_token nije uspjela',
  callback_iss_mismatch: 'iss u povratnom pozivu autorizacije ne odgovara konfiguraciji',
  callback_unsupported_response:
    'Povratni poziv autorizacije sadrži nepodržane parametre implicitnog/hibridnog toka',
});
