import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl நேர்மறை கால அளவாக இருக்க வேண்டும்',
  client_id_empty: 'clientId காலியாக இருக்கக்கூடாது',
  client_secret_empty: 'clientSecret காலியாக இருக்கக்கூடாது',
  authorization_endpoint_empty: 'authorizationEndpoint காலியாக இருக்கக்கூடாது',
  token_endpoint_empty: 'tokenEndpoint காலியாக இருக்கக்கூடாது',
  redirect_uri_empty: 'redirectUri காலியாக இருக்கக்கூடாது',
  missing_code_or_state: 'code அல்லது state இல்லை',
  invalid_state: 'செல்லாத அல்லது காலாவதியான state',
  authorization_denied: 'அங்கீகாரம் மறுக்கப்பட்டது: {{error}}',
  token_exchange_failed: 'access_token பரிமாற்றம் தோல்வியடைந்தது',
  token_type_invalid: 'டோக்கன் பதிலின் token_type செல்லாதது அல்லது ஆதரிக்கப்படவில்லை',
  refresh_token_empty: 'refreshToken காலியாக இருக்கக்கூடாது',
  token_refresh_failed: 'access_token புதுப்பிப்பு தோல்வியடைந்தது',
  revoke_token_empty: 'token காலியாக இருக்கக்கூடாது',
  revocation_endpoint_empty:
    'revocationEndpoint கட்டமைக்கப்படவில்லை மற்றும் discovery வழங்கவில்லை',
  token_revoke_failed: 'டோக்கன் ரத்து தோல்வியடைந்தது',
  oidc_issuer_empty: 'oidc.issuer காலியாக இருக்கக்கூடாது',
  oidc_discovery_failed: 'OIDC discovery தோல்வியடைந்தது',
  oidc_issuer_mismatch: 'OIDC discovery திருப்பிய issuer கட்டமைப்புடன் பொருந்தவில்லை',
  oidc_jwks_uri_missing: 'jwks_uri இல்லை',
  oidc_missing_id_token: 'டோக்கன் பதிலில் id_token இல்லை',
  oidc_id_token_invalid: 'id_token சரிபார்ப்பு தோல்வியடைந்தது',
  oidc_nonce_mismatch: 'id_token nonce பொருந்தவில்லை',
  oidc_at_hash_mismatch: 'id_token at_hash, access_token உடன் பொருந்தவில்லை',
  oidc_azp_mismatch: 'id_token azp சரிபார்ப்பு தோல்வியடைந்தது',
  callback_iss_mismatch: 'அங்கீகார அழைப்புத் திரும்பலின் iss கட்டமைப்புடன் பொருந்தவில்லை',
  callback_unsupported_response:
    'அங்கீகார அழைப்புத் திரும்பலில் ஆதரிக்கப்படாத மறைமுக/கலப்பு ஓட்ட அளவுருக்கள் உள்ளன',
});
