import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl-ը պետք է լինի դրական տևողություն',
  client_id_empty: 'clientId-ը չի կարող դատարկ լինել',
  client_secret_empty: 'clientSecret-ը չի կարող դատարկ լինել',
  authorization_endpoint_empty: 'authorizationEndpoint-ը չի կարող դատարկ լինել',
  token_endpoint_empty: 'tokenEndpoint-ը չի կարող դատարկ լինել',
  redirect_uri_empty: 'redirectUri-ը չի կարող դատարկ լինել',
  missing_code_or_state: 'Բացակայում է code կամ state',
  invalid_state: 'Անվավեր կամ ժամկետանց state',
  authorization_denied: 'Թույլտվությունը մերժված է. {{error}}',
  token_exchange_failed: 'access_token-ի փոխանակումը ձախողվեց',
  token_type_invalid: 'Պատասխանի token_type-ը անվավեր է կամ չի աջակցվում',
  refresh_token_empty: 'refreshToken-ը չի կարող դատարկ լինել',
  token_refresh_failed: 'access_token-ի թարմացումը ձախողվեց',
  revoke_token_empty: 'token-ը չի կարող դատարկ լինել',
  revocation_endpoint_empty:
    'revocationEndpoint-ը կազմաձևված չէ, և discovery-ն չի տրամադրել',
  token_revoke_failed: 'Նշանի չեղարկումը ձախողվեց',
  oidc_issuer_empty: 'oidc.issuer-ը չի կարող դատարկ լինել',
  oidc_discovery_failed: 'OIDC discovery-ն ձախողվեց',
  oidc_issuer_mismatch:
    'OIDC discovery-ի վերադարձրած issuer-ը չի համընկնում կազմաձևման հետ',
  oidc_jwks_uri_missing: 'Բացակայում է jwks_uri',
  oidc_missing_id_token: 'Պատասխանում բացակայում է id_token',
  oidc_id_token_invalid: 'id_token-ի ստուգումը ձախողվեց',
  oidc_nonce_mismatch: 'id_token-ի nonce-ը չի համընկնում',
  oidc_at_hash_mismatch: 'id_token-ի at_hash-ը չի համընկնում access_token-ի հետ',
  oidc_azp_mismatch: 'id_token-ի azp-ի ստուգումը ձախողվեց',
  callback_iss_mismatch: 'Թույլտվության հետզանգի iss-ը չի համընկնում կազմաձևման հետ',
  callback_unsupported_response:
    'Թույլտվության հետզանգը պարունակում է չաջակցվող implicit/hybrid հոսքի պարամետրեր',
});
