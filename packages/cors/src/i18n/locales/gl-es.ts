import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'cando credentials é true, origin debe configurarse de forma explícita (orixe concreta, lista branca ou función que devolva unha orixe concreta); a reflexión por defecto non está permitida',
  credentials_with_wildcard_origin:
    'cando credentials é true, origin non pode ser "*": os navegadores rexeitan esta combinación; use unha orixe concreta, unha lista branca ou unha función que devolva unha orixe concreta',
});
