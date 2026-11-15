import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} trebuie să fie de tipul Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} trebuie să fie de tip ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Nu este acceptat încă {{validator}}',
  },
});
