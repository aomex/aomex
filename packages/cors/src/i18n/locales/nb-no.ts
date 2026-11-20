import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'når credentials er true må origin angis eksplisitt (konkret origin, hviteliste eller funksjon som returnerer et konkret origin); standardrefleksjon er ikke tillatt',
  credentials_with_wildcard_origin:
    'når credentials er true kan ikke origin være "*": nettlesere avviser denne kombinasjonen; bruk et konkret origin, en hviteliste eller en funksjon som returnerer et konkret origin',
});
