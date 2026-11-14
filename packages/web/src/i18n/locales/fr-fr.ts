import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} doit être un fichier',
      too_large: 'Le fichier {{label}} est trop volumineux',
      unsupported_mimetype: "Le type de fichier {{label}} n'est pas pris en charge",
    },
  },
  response: {
    redirect: 'Redirection vers {{url}}',
  },
});
