import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'kun credentials on true, origin on asetettava eksplisiittisesti (konkreettinen origin, sallittujen lista tai konkreettisen originin palauttava funktio); oletusheijastus ei ole sallittu',
  credentials_with_wildcard_origin:
    'kun credentials on true, origin ei voi olla "*": selaimet eivät hyväksy tätä yhdistelmää; käytä konkreettista originiä, sallittujen listaa tai funktiota, joka palauttaa konkreettisen originin',
});
