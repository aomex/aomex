import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl ಧನಾತ್ಮಕ ಅವಧಿಯಾಗಿರಬೇಕು',
  client_id_empty: 'clientId ಖಾಲಿ ಇರಬಾರದು',
  client_secret_empty: 'clientSecret ಖಾಲಿ ಇರಬಾರದು',
  authorization_endpoint_empty: 'authorizationEndpoint ಖಾಲಿ ಇರಬಾರದು',
  token_endpoint_empty: 'tokenEndpoint ಖಾಲಿ ಇರಬಾರದು',
  redirect_uri_empty: 'redirectUri ಖಾಲಿ ಇರಬಾರದು',
  missing_code_or_state: 'code ಅಥವಾ state ಇಲ್ಲ',
  invalid_state: 'ಅಮಾನ್ಯ ಅಥವಾ ಅವಧಿ ಮೀರಿದ state',
  authorization_denied: 'ಅಧಿಕಾರ ನಿರಾಕರಿಸಲಾಗಿದೆ: {{error}}',
  token_exchange_failed: 'access_token ವಿನಿಮಯ ವಿಫಲವಾಗಿದೆ',
  token_type_invalid: 'ಟೋಕನ್ ಪ್ರತಿಕ್ರಿಯೆಯ token_type ಅಮಾನ್ಯ ಅಥವಾ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ',
  refresh_token_empty: 'refreshToken ಖಾಲಿ ಇರಬಾರದು',
  token_refresh_failed: 'access_token ರಿಫ್ರೆಶ್ ವಿಫಲವಾಗಿದೆ',
  revoke_token_empty: 'token ಖಾಲಿ ಇರಬಾರದು',
  revocation_endpoint_empty: 'revocationEndpoint ಸಂರಚಿಸಲಾಗಿಲ್ಲ ಮತ್ತು discovery ಒದಗಿಸಿಲ್ಲ',
  token_revoke_failed: 'ಟೋಕನ್ ರದ್ದು ವಿಫಲವಾಗಿದೆ',
  oidc_issuer_empty: 'oidc.issuer ಖಾಲಿ ಇರಬಾರದು',
  oidc_discovery_failed: 'OIDC discovery ವಿಫಲವಾಗಿದೆ',
  oidc_issuer_mismatch: 'OIDC discovery ಹಿಂತಿರುಗಿಸಿದ issuer ಸಂರಚನೆಯೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ',
  oidc_jwks_uri_missing: 'jwks_uri ಇಲ್ಲ',
  oidc_missing_id_token: 'ಟೋಕನ್ ಪ್ರತಿಕ್ರಿಯೆಯಲ್ಲಿ id_token ಇಲ್ಲ',
  oidc_id_token_invalid: 'id_token ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ',
  oidc_nonce_mismatch: 'id_token nonce ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ',
  oidc_at_hash_mismatch: 'id_token at_hash, access_token ಜೊತೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ',
  oidc_azp_mismatch: 'id_token azp ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ',
  callback_iss_mismatch: 'ಅಧಿಕಾರ ಕಾಲ್‌ಬ್ಯಾಕ್‌ನ iss ಸಂರಚನೆಯೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ',
  callback_unsupported_response:
    'ಅಧಿಕಾರ ಕಾಲ್‌ಬ್ಯಾಕ್‌ನಲ್ಲಿ ಬೆಂಬಲಿಸದ ಅಂತರ್ಗತ/ಹೈಬ್ರಿಡ್ ಹರಿವು ಪ್ಯಾರಾಮೀಟರ್‌ಗಳಿವೆ',
});
