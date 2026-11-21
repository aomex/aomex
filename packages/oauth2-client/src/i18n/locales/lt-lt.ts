import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl turi būti teigiama trukmė',
  client_id_empty: 'clientId negali būti tuščias',
  client_secret_empty: 'clientSecret negali būti tuščias',
  authorization_endpoint_empty: 'authorizationEndpoint negali būti tuščias',
  token_endpoint_empty: 'tokenEndpoint negali būti tuščias',
  redirect_uri_empty: 'redirectUri negali būti tuščias',
  missing_code_or_state: 'Trūksta code arba state',
  invalid_state: 'Netinkamas arba pasibaigęs state',
  authorization_denied: 'Įgaliojimas atmestas: {{error}}',
  token_exchange_failed: 'Nepavyko iškeisti access_token',
  token_type_invalid: 'Atsakyme esantis token_type netinkamas arba nepalaikomas',
  refresh_token_empty: 'refreshToken negali būti tuščias',
  token_refresh_failed: 'Nepavyko atnaujinti access_token',
  revoke_token_empty: 'token negali būti tuščias',
  revocation_endpoint_empty:
    'revocationEndpoint nesukonfigūruotas, o discovery jo nepateikė',
  token_revoke_failed: 'Nepavyko atšaukti prieigos rakto',
  oidc_issuer_empty: 'oidc.issuer negali būti tuščias',
  oidc_discovery_failed: 'OIDC discovery nepavyko',
  oidc_issuer_mismatch: 'OIDC discovery grąžintas issuer nesutampa su konfigūracija',
  oidc_jwks_uri_missing: 'Trūksta jwks_uri',
  oidc_missing_id_token: 'Atsakyme nėra id_token',
  oidc_id_token_invalid: 'id_token patikra nepavyko',
  oidc_nonce_mismatch: 'id_token nonce nesutampa',
  oidc_at_hash_mismatch: 'id_token at_hash nesutampa su access_token',
  oidc_azp_mismatch: 'id_token azp patikra nepavyko',
  callback_iss_mismatch: 'Įgaliojimo atgalinio iškvietimo iss nesutampa su konfigūracija',
  callback_unsupported_response:
    'Įgaliojimo atgalinis iškvietimas turi nepalaikomų implicit/hybrid srauto parametrų',
});
