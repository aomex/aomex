import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'als credentials true is, moet origin expliciet worden ingesteld (concrete origin, whitelist of functie die een concrete origin teruggeeft); standaardreflectie is niet toegestaan',
  credentials_with_wildcard_origin:
    'origin mag geen "*" zijn als credentials true is: browsers accepteren deze combinatie niet; gebruik een concrete origin, een whitelist of een functie die een concrete origin teruggeeft',
});
