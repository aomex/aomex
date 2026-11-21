import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl musí byť kladné trvanie',
  client_id_empty: 'clientId nesmie byť prázdny',
  client_secret_empty: 'clientSecret nesmie byť prázdny',
  authorization_endpoint_empty: 'authorizationEndpoint nesmie byť prázdny',
  token_endpoint_empty: 'tokenEndpoint nesmie byť prázdny',
  redirect_uri_empty: 'redirectUri nesmie byť prázdny',
  missing_code_or_state: 'Chýba code alebo state',
  invalid_state: 'Neplatný alebo vypršaný state',
  authorization_denied: 'Autorizácia zamietnutá: {{error}}',
  token_exchange_failed: 'Výmena access_token zlyhala',
  token_type_invalid: 'token_type v odpovedi tokenu je neplatný alebo nepodporovaný',
  refresh_token_empty: 'refreshToken nesmie byť prázdny',
  token_refresh_failed: 'Obnovenie access_token zlyhalo',
  revoke_token_empty: 'token nesmie byť prázdny',
  revocation_endpoint_empty:
    'revocationEndpoint nie je nakonfigurovaný a discovery ho neposkytol',
  token_revoke_failed: 'Zrušenie tokenu zlyhalo',
  oidc_issuer_empty: 'oidc.issuer nesmie byť prázdny',
  oidc_discovery_failed: 'OIDC discovery zlyhalo',
  oidc_issuer_mismatch: 'issuer vrátený OIDC discovery nezodpovedá konfigurácii',
  oidc_jwks_uri_missing: 'Chýba jwks_uri',
  oidc_missing_id_token: 'Odpoveď tokenu neobsahuje id_token',
  oidc_id_token_invalid: 'Overenie id_token zlyhalo',
  oidc_nonce_mismatch: 'nonce v id_token sa nezhoduje',
  oidc_at_hash_mismatch: 'at_hash v id_token sa nezhoduje s access_token',
  oidc_azp_mismatch: 'Overenie azp v id_token zlyhalo',
  callback_iss_mismatch: 'iss v autorizačnom callbacku nezodpovedá konfigurácii',
  callback_unsupported_response:
    'Autorizačný callback obsahuje nepodporované parametre implicitného/hybridného toku',
});
