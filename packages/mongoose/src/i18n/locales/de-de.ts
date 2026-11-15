import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} muss vom Typ Decimal128 sein',
    },
    objectId: {
      must_be_objectId: '{{label}} muss vom Typ ObjectId sein',
    },
  },
  mongoose: {
    unsupported_validator: 'Noch nicht unterstützt {{validator}}',
  },
});
