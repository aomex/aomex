import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl musi być dodatnim czasem trwania',
  client_id_empty: 'clientId nie może być pusty',
  client_secret_empty: 'clientSecret nie może być pusty',
  authorization_endpoint_empty: 'authorizationEndpoint nie może być pusty',
  token_endpoint_empty: 'tokenEndpoint nie może być pusty',
  redirect_uri_empty: 'redirectUri nie może być pusty',
  missing_code_or_state: 'Brakuje code lub state',
  invalid_state: 'Nieprawidłowy lub wygasły state',
  authorization_denied: 'Autoryzacja odrzucona: {{error}}',
  token_exchange_failed: 'Nie udało się wymienić access_token',
  token_type_invalid:
    'token_type w odpowiedzi tokenu jest nieprawidłowy lub nieobsługiwany',
  refresh_token_empty: 'refreshToken nie może być pusty',
  token_refresh_failed: 'Nie udało się odświeżyć access_token',
  revoke_token_empty: 'token nie może być pusty',
  revocation_endpoint_empty:
    'revocationEndpoint nie jest skonfigurowany, a discovery go nie dostarczył',
  token_revoke_failed: 'Nie udało się unieważnić tokenu',
  oidc_issuer_empty: 'oidc.issuer nie może być pusty',
  oidc_discovery_failed: 'OIDC discovery nie powiódł się',
  oidc_issuer_mismatch:
    'issuer zwrócony przez OIDC discovery nie jest zgodny z konfiguracją',
  oidc_jwks_uri_missing: 'Brakuje jwks_uri',
  oidc_missing_id_token: 'Odpowiedź tokenu nie zawiera id_token',
  oidc_id_token_invalid: 'Weryfikacja id_token nie powiodła się',
  oidc_nonce_mismatch: 'nonce w id_token nie jest zgodny',
  oidc_at_hash_mismatch: 'at_hash w id_token nie jest zgodny z access_token',
  oidc_azp_mismatch: 'Weryfikacja azp w id_token nie powiodła się',
  callback_iss_mismatch:
    'iss w wywołaniu zwrotnym autoryzacji nie jest zgodny z konfiguracją',
  callback_unsupported_response:
    'Wywołanie zwrotne autoryzacji zawiera nieobsługiwane parametry przepływu implicit/hybrid',
});
