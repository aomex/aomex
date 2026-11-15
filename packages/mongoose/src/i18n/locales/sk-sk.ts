import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} musí byť typu Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} musí byť typu ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Zatiaľ nie je podporované {{validator}}',
  },
});
