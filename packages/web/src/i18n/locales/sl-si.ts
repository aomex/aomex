import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} mora biti datoteka',
      too_large: 'Datoteka {{label}} je prevelika',
      unsupported_mimetype: 'Vrsta datoteke {{label}} ni podprta',
    },
  },
  response: {
    redirect: 'Preusmerjanje na {{url}}',
  },
});
