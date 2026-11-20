import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'cuando credentials es true, origin debe configurarse explícitamente (origen concreto, lista blanca o función que devuelva un origen concreto); no se permite la reflexión por defecto',
  credentials_with_wildcard_origin:
    'origin no puede ser "*" cuando credentials es true: los navegadores rechazan esta combinación; use un origen concreto, una lista blanca o una función que devuelva un origen concreto',
});
