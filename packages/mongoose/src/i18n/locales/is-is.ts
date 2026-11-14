import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} verður að vera af gerðinni Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} verður að vera af gerðinni ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Ekki studd enn {{validator}}',
  },
  migration: {
    create: 'Búðu til flutningsskrá',
    up: 'Framkvæma flutning',
    down: 'Flutningur til baka',
    file_not_found: 'Flutningaskráin „{{file}}“ er ekki til',
    input_file_name: 'Vinsamlega sláðu inn nafn flutningsskrárinnar:',
    file_created: 'Flutningaskráin var búin til "{{file}}"',
  },
});
