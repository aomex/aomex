import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl harus berupa durasi positif',
  client_id_empty: 'clientId tidak boleh kosong',
  client_secret_empty: 'clientSecret tidak boleh kosong',
  authorization_endpoint_empty: 'authorizationEndpoint tidak boleh kosong',
  token_endpoint_empty: 'tokenEndpoint tidak boleh kosong',
  redirect_uri_empty: 'redirectUri tidak boleh kosong',
  missing_code_or_state: 'code atau state tidak ada',
  invalid_state: 'state tidak valid atau sudah kedaluwarsa',
  authorization_denied: 'Otorisasi ditolak: {{error}}',
  token_exchange_failed: 'Gagal menukar access_token',
  token_type_invalid: 'token_type dalam respons token tidak valid atau tidak didukung',
  refresh_token_empty: 'refreshToken tidak boleh kosong',
  token_refresh_failed: 'Gagal memperbarui access_token',
  revoke_token_empty: 'token tidak boleh kosong',
  revocation_endpoint_empty:
    'revocationEndpoint tidak dikonfigurasi dan discovery tidak menyediakannya',
  token_revoke_failed: 'Gagal mencabut token',
  oidc_issuer_empty: 'oidc.issuer tidak boleh kosong',
  oidc_discovery_failed: 'OIDC discovery gagal',
  oidc_issuer_mismatch:
    'issuer yang dikembalikan OIDC discovery tidak cocok dengan konfigurasi',
  oidc_jwks_uri_missing: 'jwks_uri tidak ada',
  oidc_missing_id_token: 'Respons token tidak memiliki id_token',
  oidc_id_token_invalid: 'Verifikasi id_token gagal',
  oidc_nonce_mismatch: 'nonce id_token tidak cocok',
  oidc_at_hash_mismatch: 'at_hash id_token tidak cocok dengan access_token',
  oidc_azp_mismatch: 'Verifikasi azp id_token gagal',
  callback_iss_mismatch: 'iss callback otorisasi tidak cocok dengan konfigurasi',
  callback_unsupported_response:
    'Callback otorisasi berisi parameter alur implisit/hibrida yang tidak didukung',
});
