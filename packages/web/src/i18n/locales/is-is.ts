import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} verður að vera skrá',
      too_large: '{{label}} skráin er of stór',
      unsupported_mimetype: 'Skráargerðin {{label}} er ekki studd',
    },
  },
  response: {
    redirect: 'Endurbeint á {{url}}',
  },
});
