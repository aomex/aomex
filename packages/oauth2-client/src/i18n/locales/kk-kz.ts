import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl оң ұзақтық болуы керек',
  client_id_empty: 'clientId бос болмауы керек',
  client_secret_empty: 'clientSecret бос болмауы керек',
  authorization_endpoint_empty: 'authorizationEndpoint бос болмауы керек',
  token_endpoint_empty: 'tokenEndpoint бос болмауы керек',
  redirect_uri_empty: 'redirectUri бос болмауы керек',
  missing_code_or_state: 'code немесе state жоқ',
  invalid_state: 'Жарамсыз немесе мерзімі өткен state',
  authorization_denied: 'Рұқсат қабылданбады: {{error}}',
  token_exchange_failed: 'access_token алмасу сәтсіз аяқталды',
  token_type_invalid: 'Токен жауабындағы token_type жарамсыз немесе қолдау көрсетілмейді',
  refresh_token_empty: 'refreshToken бос болмауы керек',
  token_refresh_failed: 'access_token жаңарту сәтсіз аяқталды',
  revoke_token_empty: 'token бос болмауы керек',
  revocation_endpoint_empty: 'revocationEndpoint бапталмаған және discovery бермеген',
  token_revoke_failed: 'Токенді кері қайтарып алу сәтсіз аяқталды',
  oidc_issuer_empty: 'oidc.issuer бос болмауы керек',
  oidc_discovery_failed: 'OIDC discovery сәтсіз аяқталды',
  oidc_issuer_mismatch: 'OIDC discovery қайтарған issuer баптаумен сәйкес келмейді',
  oidc_jwks_uri_missing: 'jwks_uri жоқ',
  oidc_missing_id_token: 'Токен жауабында id_token жоқ',
  oidc_id_token_invalid: 'id_token тексеруі сәтсіз аяқталды',
  oidc_nonce_mismatch: 'id_token nonce сәйкес келмейді',
  oidc_at_hash_mismatch: 'id_token at_hash access_token-мен сәйкес келмейді',
  oidc_azp_mismatch: 'id_token azp тексеруі сәтсіз аяқталды',
  callback_iss_mismatch: 'Рұқсат кері шақыруындағы iss баптаумен сәйкес келмейді',
  callback_unsupported_response:
    'Рұқсат кері шақыруында қолдау көрсетілмейтін implicit/hybrid ағын параметрлері бар',
});
