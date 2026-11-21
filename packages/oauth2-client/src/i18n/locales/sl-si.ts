import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl mora biti pozitivno trajanje',
  client_id_empty: 'clientId ne sme biti prazen',
  client_secret_empty: 'clientSecret ne sme biti prazen',
  authorization_endpoint_empty: 'authorizationEndpoint ne sme biti prazen',
  token_endpoint_empty: 'tokenEndpoint ne sme biti prazen',
  redirect_uri_empty: 'redirectUri ne sme biti prazen',
  missing_code_or_state: 'Manjka code ali state',
  invalid_state: 'Neveljaven ali potekel state',
  authorization_denied: 'Avtorizacija zavrnjena: {{error}}',
  token_exchange_failed: 'Zamenjava access_token ni uspela',
  token_type_invalid: 'token_type v odgovoru žetona je neveljaven ali ni podprt',
  refresh_token_empty: 'refreshToken ne sme biti prazen',
  token_refresh_failed: 'Osvežitev access_token ni uspela',
  revoke_token_empty: 'token ne sme biti prazen',
  revocation_endpoint_empty:
    'revocationEndpoint ni konfiguriran in discovery ga ni zagotovil',
  token_revoke_failed: 'Preklic žetona ni uspel',
  oidc_issuer_empty: 'oidc.issuer ne sme biti prazen',
  oidc_discovery_failed: 'OIDC discovery ni uspel',
  oidc_issuer_mismatch:
    'issuer, ki ga je vrnil OIDC discovery, se ne ujema s konfiguracijo',
  oidc_jwks_uri_missing: 'Manjka jwks_uri',
  oidc_missing_id_token: 'Odgovor žetona ne vsebuje id_token',
  oidc_id_token_invalid: 'Preverjanje id_token ni uspelo',
  oidc_nonce_mismatch: 'nonce v id_token se ne ujema',
  oidc_at_hash_mismatch: 'at_hash v id_token se ne ujema z access_token',
  oidc_azp_mismatch: 'Preverjanje azp v id_token ni uspelo',
  callback_iss_mismatch: 'iss v povratnem klicu avtorizacije se ne ujema s konfiguracijo',
  callback_unsupported_response:
    'Povratni klic avtorizacije vsebuje nepodprte parametre implicitnega/hibridnega toka',
});
