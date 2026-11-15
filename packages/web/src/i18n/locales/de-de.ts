import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} muss eine Datei sein',
      too_large: 'Die {{label}} -Datei ist zu groß',
      unsupported_mimetype: 'Der Dateityp {{label}} wird nicht unterstützt',
      invalid_mimetype_token: 'Ungültiger Medientyp oder Dateierweiterung: {{token}}',
    },
  },
  response: {
    redirect: 'Weiterleitung zu {{url}}',
  },
});
