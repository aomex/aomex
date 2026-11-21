import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl deve ser uma duração positiva',
  client_id_empty: 'clientId não pode estar vazio',
  client_secret_empty: 'clientSecret não pode estar vazio',
  authorization_endpoint_empty: 'authorizationEndpoint não pode estar vazio',
  token_endpoint_empty: 'tokenEndpoint não pode estar vazio',
  redirect_uri_empty: 'redirectUri não pode estar vazio',
  missing_code_or_state: 'code ou state ausente',
  invalid_state: 'state inválido ou expirado',
  authorization_denied: 'Autorização negada: {{error}}',
  token_exchange_failed: 'Falha ao trocar access_token',
  token_type_invalid: 'token_type da resposta de token inválido ou não suportado',
  refresh_token_empty: 'refreshToken não pode estar vazio',
  token_refresh_failed: 'Falha ao atualizar access_token',
  revoke_token_empty: 'token não pode estar vazio',
  revocation_endpoint_empty:
    'revocationEndpoint não está configurado e discovery não o forneceu',
  token_revoke_failed: 'Falha ao revogar o token',
  oidc_issuer_empty: 'oidc.issuer não pode estar vazio',
  oidc_discovery_failed: 'OIDC discovery falhou',
  oidc_issuer_mismatch:
    'O issuer retornado pelo OIDC discovery não coincide com a configuração',
  oidc_jwks_uri_missing: 'jwks_uri ausente',
  oidc_missing_id_token: 'A resposta de token não inclui id_token',
  oidc_id_token_invalid: 'Falha na verificação de id_token',
  oidc_nonce_mismatch: 'nonce de id_token não coincide',
  oidc_at_hash_mismatch: 'at_hash de id_token não coincide com access_token',
  oidc_azp_mismatch: 'Falha na verificação de azp de id_token',
  callback_iss_mismatch: 'iss do callback de autorização não coincide com a configuração',
  callback_unsupported_response:
    'O callback de autorização contém parâmetros de fluxo implícito/híbrido não suportados',
});
