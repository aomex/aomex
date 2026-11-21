import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'stateTtl ต้องเป็นระยะเวลาที่เป็นบวก',
  client_id_empty: 'clientId ต้องไม่ว่างเปล่า',
  client_secret_empty: 'clientSecret ต้องไม่ว่างเปล่า',
  authorization_endpoint_empty: 'authorizationEndpoint ต้องไม่ว่างเปล่า',
  token_endpoint_empty: 'tokenEndpoint ต้องไม่ว่างเปล่า',
  redirect_uri_empty: 'redirectUri ต้องไม่ว่างเปล่า',
  missing_code_or_state: 'ขาด code หรือ state',
  invalid_state: 'state ไม่ถูกต้องหรือหมดอายุแล้ว',
  authorization_denied: 'การอนุญาตถูกปฏิเสธ: {{error}}',
  token_exchange_failed: 'แลก access_token ไม่สำเร็จ',
  token_type_invalid: 'token_type ในการตอบกลับโทเค็นไม่ถูกต้องหรือไม่รองรับ',
  refresh_token_empty: 'refreshToken ต้องไม่ว่างเปล่า',
  token_refresh_failed: 'รีเฟรช access_token ไม่สำเร็จ',
  revoke_token_empty: 'token ต้องไม่ว่างเปล่า',
  revocation_endpoint_empty: 'ไม่ได้กำหนด revocationEndpoint และ discovery ไม่ได้ให้มา',
  token_revoke_failed: 'เพิกถอนโทเค็นไม่สำเร็จ',
  oidc_issuer_empty: 'oidc.issuer ต้องไม่ว่างเปล่า',
  oidc_discovery_failed: 'OIDC discovery ล้มเหลว',
  oidc_issuer_mismatch: 'issuer ที่ OIDC discovery ส่งกลับไม่ตรงกับการกำหนดค่า',
  oidc_jwks_uri_missing: 'ขาด jwks_uri',
  oidc_missing_id_token: 'การตอบกลับโทเค็นไม่มี id_token',
  oidc_id_token_invalid: 'การตรวจสอบ id_token ล้มเหลว',
  oidc_nonce_mismatch: 'nonce ของ id_token ไม่ตรงกัน',
  oidc_at_hash_mismatch: 'at_hash ของ id_token ไม่ตรงกับ access_token',
  oidc_azp_mismatch: 'การตรวจสอบ azp ของ id_token ล้มเหลว',
  callback_iss_mismatch: 'iss ของการเรียกกลับการอนุญาตไม่ตรงกับการกำหนดค่า',
  callback_unsupported_response:
    'การเรียกกลับการอนุญาตมีพารามิเตอร์โฟลว์แบบ implicit/hybrid ที่ไม่รองรับ',
});
