import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'Το stateTtl πρέπει να είναι θετική διάρκεια',
  client_id_empty: 'Το clientId δεν πρέπει να είναι κενό',
  client_secret_empty: 'Το clientSecret δεν πρέπει να είναι κενό',
  authorization_endpoint_empty: 'Το authorizationEndpoint δεν πρέπει να είναι κενό',
  token_endpoint_empty: 'Το tokenEndpoint δεν πρέπει να είναι κενό',
  redirect_uri_empty: 'Το redirectUri δεν πρέπει να είναι κενό',
  missing_code_or_state: 'Λείπει το code ή το state',
  invalid_state: 'Μη έγκυρο ή ληγμένο state',
  authorization_denied: 'Η εξουσιοδότηση απορρίφθηκε: {{error}}',
  token_exchange_failed: 'Αποτυχία ανταλλαγής access_token',
  token_type_invalid:
    'Το token_type στην απάντηση διακριτικού είναι μη έγκυρο ή μη υποστηριζόμενο',
  refresh_token_empty: 'Το refreshToken δεν πρέπει να είναι κενό',
  token_refresh_failed: 'Αποτυχία ανανέωσης access_token',
  revoke_token_empty: 'Το token δεν πρέπει να είναι κενό',
  revocation_endpoint_empty:
    'Το revocationEndpoint δεν έχει ρυθμιστεί και το discovery δεν το παρείχε',
  token_revoke_failed: 'Αποτυχία ανάκλησης διακριτικού',
  oidc_issuer_empty: 'Το oidc.issuer δεν πρέπει να είναι κενό',
  oidc_discovery_failed: 'Το OIDC discovery απέτυχε',
  oidc_issuer_mismatch:
    'Το issuer που επέστρεψε το OIDC discovery δεν συμφωνεί με τη ρύθμιση',
  oidc_jwks_uri_missing: 'Λείπει το jwks_uri',
  oidc_missing_id_token: 'Η απάντηση διακριτικού δεν περιλαμβάνει id_token',
  oidc_id_token_invalid: 'Η επαλήθευση του id_token απέτυχε',
  oidc_nonce_mismatch: 'Το nonce του id_token δεν συμφωνεί',
  oidc_at_hash_mismatch: 'Το at_hash του id_token δεν συμφωνεί με το access_token',
  oidc_azp_mismatch: 'Η επαλήθευση azp του id_token απέτυχε',
  callback_iss_mismatch:
    'Το iss της επανάκλησης εξουσιοδότησης δεν συμφωνεί με τη ρύθμιση',
  callback_unsupported_response:
    'Η επανάκληση εξουσιοδότησης περιέχει μη υποστηριζόμενες παραμέτρους implicit/hybrid ροής',
});
