import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'калі credentials роўны true, трэба відавочна задаць origin (канкрэтны origin, белы спіс або функцыю, якая вяртае канкрэтны origin); адлюстраванне па змаўчанні забаронена',
  credentials_with_wildcard_origin:
    'калі credentials роўны true, origin не можа быць "*": браўзеры не прымаюць гэту камбінацыю; укажыце канкрэтны origin, белы спіс або функцыю, якая вяртае канкрэтны origin',
});
