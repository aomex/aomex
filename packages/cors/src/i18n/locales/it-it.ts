import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    "quando credentials è true, origin deve essere impostato esplicitamente (origine concreta, whitelist o funzione che restituisce un'origine concreta); la riflessione predefinita non è consentita",
  credentials_with_wildcard_origin:
    'origin non può essere "*" quando credentials è true: i browser rifiutano questa combinazione; usare un\'origine concreta, una whitelist o una funzione che restituisce un\'origine concreta',
});
