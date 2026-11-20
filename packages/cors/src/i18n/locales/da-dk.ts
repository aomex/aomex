import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'når credentials er true, skal origin angives eksplicit (konkret origin, hvidliste eller funktion, der returnerer et konkret origin); standardreflektion er ikke tilladt',
  credentials_with_wildcard_origin:
    'når credentials er true, må origin ikke være "*": browsere afviser denne kombination; brug et konkret origin, en hvidliste eller en funktion, der returnerer et konkret origin',
});
