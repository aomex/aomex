import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  state_ttl_invalid: 'A stateTtl pozitív időtartam kell legyen',
  client_id_empty: 'A clientId nem lehet üres',
  client_secret_empty: 'A clientSecret nem lehet üres',
  authorization_endpoint_empty: 'Az authorizationEndpoint nem lehet üres',
  token_endpoint_empty: 'A tokenEndpoint nem lehet üres',
  redirect_uri_empty: 'A redirectUri nem lehet üres',
  missing_code_or_state: 'Hiányzik a code vagy a state',
  invalid_state: 'Érvénytelen vagy lejárt state',
  authorization_denied: 'Engedélyezés elutasítva: {{error}}',
  token_exchange_failed: 'Az access_token csere sikertelen',
  token_type_invalid: 'A tokenválasz token_type értéke érvénytelen vagy nem támogatott',
  refresh_token_empty: 'A refreshToken nem lehet üres',
  token_refresh_failed: 'Az access_token frissítése sikertelen',
  revoke_token_empty: 'A token nem lehet üres',
  revocation_endpoint_empty:
    'A revocationEndpoint nincs beállítva, és a discovery sem adta meg',
  token_revoke_failed: 'A token visszavonása sikertelen',
  oidc_issuer_empty: 'Az oidc.issuer nem lehet üres',
  oidc_discovery_failed: 'Az OIDC discovery sikertelen',
  oidc_issuer_mismatch:
    'Az OIDC discovery által visszaadott issuer nem egyezik a konfigurációval',
  oidc_jwks_uri_missing: 'Hiányzik a jwks_uri',
  oidc_missing_id_token: 'A tokenválaszból hiányzik az id_token',
  oidc_id_token_invalid: 'Az id_token ellenőrzése sikertelen',
  oidc_nonce_mismatch: 'Az id_token nonce nem egyezik',
  oidc_at_hash_mismatch: 'Az id_token at_hash nem egyezik az access_tokennel',
  oidc_azp_mismatch: 'Az id_token azp ellenőrzése sikertelen',
  callback_iss_mismatch:
    'Az engedélyezési visszahívás iss értéke nem egyezik a konfigurációval',
  callback_unsupported_response:
    'Az engedélyezési visszahívás nem támogatott implicit/hibrid folyamatparamétereket tartalmaz',
});
