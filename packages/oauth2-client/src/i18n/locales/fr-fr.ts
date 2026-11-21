import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl doit être une durée positive',
  client_id_empty: 'clientId ne doit pas être vide',
  client_secret_empty: 'clientSecret ne doit pas être vide',
  authorization_endpoint_empty: 'authorizationEndpoint ne doit pas être vide',
  token_endpoint_empty: 'tokenEndpoint ne doit pas être vide',
  redirect_uri_empty: 'redirectUri ne doit pas être vide',
  missing_code_or_state: 'code ou state manquant',
  invalid_state: 'state invalide ou expiré',
  authorization_denied: 'Autorisation refusée : {{error}}',
  token_exchange_failed: "Échec de l'échange de access_token",
  token_type_invalid: 'token_type de la réponse de jeton invalide ou non pris en charge',
  refresh_token_empty: 'refreshToken ne doit pas être vide',
  token_refresh_failed: 'Échec du rafraîchissement de access_token',
  revoke_token_empty: 'token ne doit pas être vide',
  revocation_endpoint_empty:
    "revocationEndpoint n'est pas configuré et discovery n'en a pas fourni",
  token_revoke_failed: 'Échec de la révocation du jeton',
  oidc_issuer_empty: 'oidc.issuer ne doit pas être vide',
  oidc_discovery_failed: 'Échec de OIDC discovery',
  oidc_issuer_mismatch:
    "L'issuer renvoyé par OIDC discovery ne correspond pas à la configuration",
  oidc_jwks_uri_missing: 'jwks_uri manquant',
  oidc_missing_id_token: 'La réponse de jeton ne contient pas id_token',
  oidc_id_token_invalid: 'Échec de la vérification de id_token',
  oidc_nonce_mismatch: 'nonce de id_token ne correspond pas',
  oidc_at_hash_mismatch: 'at_hash de id_token ne correspond pas à access_token',
  oidc_azp_mismatch: 'Échec de la vérification de azp de id_token',
  callback_iss_mismatch:
    "iss du rappel d'autorisation ne correspond pas à la configuration",
  callback_unsupported_response:
    "Le rappel d'autorisation contient des paramètres de flux implicite/hybride non pris en charge",
});
