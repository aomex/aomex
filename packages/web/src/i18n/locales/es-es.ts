import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} debe ser un archivo',
      too_large: 'El archivo {{label}} es demasiado grande',
      unsupported_mimetype: 'El tipo de archivo {{label}} no es compatible',
    },
  },
  response: {
    redirect: 'Redirigiendo a {{url}}',
  },
});
