import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl ត្រូវតែជារយៈពេលវិជ្ជមាន',
  client_id_empty: 'clientId មិនអាចទទេបានទេ',
  client_secret_empty: 'clientSecret មិនអាចទទេបានទេ',
  authorization_endpoint_empty: 'authorizationEndpoint មិនអាចទទេបានទេ',
  token_endpoint_empty: 'tokenEndpoint មិនអាចទទេបានទេ',
  redirect_uri_empty: 'redirectUri មិនអាចទទេបានទេ',
  missing_code_or_state: 'ខ្វះ code ឬ state',
  invalid_state: 'state មិនត្រឹមត្រូវ ឬផុតកំណត់',
  authorization_denied: 'ការអនុញ្ញាតត្រូវបានបដិសេធ៖ {{error}}',
  token_exchange_failed: 'ការផ្លាស់ប្តូរ access_token បរាជ័យ',
  token_type_invalid: 'token_type ក្នុងការឆ្លើយតបថូខឹនមិនត្រឹមត្រូវ ឬមិនគាំទ្រ',
  refresh_token_empty: 'refreshToken មិនអាចទទេបានទេ',
  token_refresh_failed: 'ការធ្វើឱ្យ access_token ថ្មីបរាជ័យ',
  revoke_token_empty: 'token មិនអាចទទេបានទេ',
  revocation_endpoint_empty: 'revocationEndpoint មិនត្រូវបានកំណត់ ហើយ discovery មិនបានផ្តល់',
  token_revoke_failed: 'ការលុបចោលថូខឹនបរាជ័យ',
  oidc_issuer_empty: 'oidc.issuer មិនអាចទទេបានទេ',
  oidc_discovery_failed: 'OIDC discovery បរាជ័យ',
  oidc_issuer_mismatch: 'issuer ដែល OIDC discovery ត្រឡប់មកមិនត្រូវនឹងការកំណត់',
  oidc_jwks_uri_missing: 'ខ្វះ jwks_uri',
  oidc_missing_id_token: 'ការឆ្លើយតបថូខឹនខ្វះ id_token',
  oidc_id_token_invalid: 'ការផ្ទៀងផ្ទាត់ id_token បរាជ័យ',
  oidc_nonce_mismatch: 'nonce របស់ id_token មិនត្រូវគ្នា',
  oidc_at_hash_mismatch: 'at_hash របស់ id_token មិនត្រូវនឹង access_token',
  oidc_azp_mismatch: 'ការផ្ទៀងផ្ទាត់ azp របស់ id_token បរាជ័យ',
  callback_iss_mismatch: 'iss នៃការហៅត្រឡប់ការអនុញ្ញាតមិនត្រូវនឹងការកំណត់',
  callback_unsupported_response:
    'ការហៅត្រឡប់ការអនុញ្ញាតមានប៉ារ៉ាម៉ែត្រលំហូរ implicit/hybrid ដែលមិនគាំទ្រ',
});
