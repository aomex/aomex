import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'wenn credentials true ist, muss origin explizit gesetzt werden (konkrete Origin, Whitelist oder Funktion, die eine konkrete Origin zurückgibt); Standard-Reflexion ist nicht erlaubt',
  credentials_with_wildcard_origin:
    'origin darf nicht "*" sein, wenn credentials true ist: Browser akzeptieren diese Kombination nicht; verwenden Sie eine konkrete Origin, eine Whitelist oder eine Funktion, die eine konkrete Origin zurückgibt',
});
