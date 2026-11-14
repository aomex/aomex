import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} fitxategi bat izan behar du',
      too_large: '{{label}} fitxategia handiegia da',
      unsupported_mimetype: '{{label}} fitxategi mota ez da onartzen',
    },
  },
  response: {
    redirect: '{{url}} helbidera birbideratzen',
  },
});
