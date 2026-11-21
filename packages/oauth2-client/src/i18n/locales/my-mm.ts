import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl သည် အပြုသဘောကာလဖြစ်ရမည်',
  client_id_empty: 'clientId သည် ဗလာမဖြစ်ရ',
  client_secret_empty: 'clientSecret သည် ဗလာမဖြစ်ရ',
  authorization_endpoint_empty: 'authorizationEndpoint သည် ဗလာမဖြစ်ရ',
  token_endpoint_empty: 'tokenEndpoint သည် ဗလာမဖြစ်ရ',
  redirect_uri_empty: 'redirectUri သည် ဗလာမဖြစ်ရ',
  missing_code_or_state: 'code သို့မဟုတ် state ပျောက်နေသည်',
  invalid_state: 'မမှန်ကန်သော သို့မဟုတ် သက်တမ်းကုန်သော state',
  authorization_denied: 'ခွင့်ပြုချက် ငြင်းပယ်ခံရသည်: {{error}}',
  token_exchange_failed: 'access_token လဲလှယ်ခြင်း မအောင်မြင်ပါ',
  token_type_invalid: 'တိုကင်တုံ့ပြန်မှု၏ token_type မမှန်ကန် သို့မဟုတ် မပံ့ပိုးပါ',
  refresh_token_empty: 'refreshToken သည် ဗလာမဖြစ်ရ',
  token_refresh_failed: 'access_token ပြန်လည်စတင်ခြင်း မအောင်မြင်ပါ',
  revoke_token_empty: 'token သည် ဗလာမဖြစ်ရ',
  revocation_endpoint_empty: 'revocationEndpoint ကို မသတ်မှတ်ထားဘဲ discovery က မပေးပါ',
  token_revoke_failed: 'တိုကင် ပယ်ဖျက်ခြင်း မအောင်မြင်ပါ',
  oidc_issuer_empty: 'oidc.issuer သည် ဗလာမဖြစ်ရ',
  oidc_discovery_failed: 'OIDC discovery မအောင်မြင်ပါ',
  oidc_issuer_mismatch: 'OIDC discovery ပြန်ပေးသော issuer သည် ဖွဲ့စည်းမှုနှင့် မကိုက်ညီပါ',
  oidc_jwks_uri_missing: 'jwks_uri ပျောက်နေသည်',
  oidc_missing_id_token: 'တိုကင်တုံ့ပြန်မှုတွင် id_token မရှိပါ',
  oidc_id_token_invalid: 'id_token အတည်ပြုခြင်း မအောင်မြင်ပါ',
  oidc_nonce_mismatch: 'id_token ၏ nonce မကိုက်ညီပါ',
  oidc_at_hash_mismatch: 'id_token ၏ at_hash သည် access_token နှင့် မကိုက်ညီပါ',
  oidc_azp_mismatch: 'id_token ၏ azp အတည်ပြုခြင်း မအောင်မြင်ပါ',
  callback_iss_mismatch: 'ခွင့်ပြုချက် ပြန်လည်ခေါ်ဆိုမှု၏ iss သည် ဖွဲ့စည်းမှုနှင့် မကိုက်ညီပါ',
  callback_unsupported_response:
    'ခွင့်ပြုချက် ပြန်လည်ခေါ်ဆိုမှုတွင် မပံ့ပိုးသော implicit/hybrid စီးဆင်းမှု ကန့်သတ်ချက်များ ပါရှိသည်',
});
