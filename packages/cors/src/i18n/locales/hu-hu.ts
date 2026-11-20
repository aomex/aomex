import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'ha a credentials true, az origin-t explicit módon be kell állítani (konkrét origin, fehérlista vagy konkrét origint visszaadó függvény); az alapértelmezett tükrözés nem megengedett',
  credentials_with_wildcard_origin:
    'ha a credentials true, az origin nem lehet "*": a böngészők nem fogadják el ezt a kombinációt; használjon konkrét origint, fehérlistát vagy konkrét origint visszaadó függvényt',
});
