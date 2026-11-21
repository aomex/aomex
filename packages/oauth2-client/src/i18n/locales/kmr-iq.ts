import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kmr-IQ */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl divê demek erênî be',
  client_id_empty: 'clientId divê vala nebe',
  client_secret_empty: 'clientSecret divê vala nebe',
  authorization_endpoint_empty: 'authorizationEndpoint divê vala nebe',
  token_endpoint_empty: 'tokenEndpoint divê vala nebe',
  redirect_uri_empty: 'redirectUri divê vala nebe',
  missing_code_or_state: 'code an state kêm e',
  invalid_state: 'state nederbasdar an qediya',
  authorization_denied: 'Destûr hate redkirin: {{error}}',
  token_exchange_failed: 'Guhertina access_token têk çû',
  token_type_invalid:
    'token_type di bersiva tokenê de nederbasdar e an nayê piştgirîkirin',
  refresh_token_empty: 'refreshToken divê vala nebe',
  token_refresh_failed: 'Nûkirina access_token têk çû',
  revoke_token_empty: 'token divê vala nebe',
  revocation_endpoint_empty: 'revocationEndpoint nehatiye mîhengkirin û discovery nedaye',
  token_revoke_failed: 'Betalkirina tokenê têk çû',
  oidc_issuer_empty: 'oidc.issuer divê vala nebe',
  oidc_discovery_failed: 'OIDC discovery têk çû',
  oidc_issuer_mismatch: 'issuer ya ku OIDC discovery vegerand bi mîhengê re nagunce',
  oidc_jwks_uri_missing: 'jwks_uri kêm e',
  oidc_missing_id_token: 'Bersiva tokenê id_token nîn e',
  oidc_id_token_invalid: 'Piştrastkirina id_token têk çû',
  oidc_nonce_mismatch: 'nonce ya id_token nagunce',
  oidc_at_hash_mismatch: 'at_hash ya id_token bi access_token re nagunce',
  oidc_azp_mismatch: 'Piştrastkirina azp ya id_token têk çû',
  callback_iss_mismatch: 'iss ya bangvegera destûrê bi mîhengê re nagunce',
  callback_unsupported_response:
    'Bangvegera destûrê parametreyên herikîna implicit/hybrid yên nepêştgirîkirî dihewîne',
});
