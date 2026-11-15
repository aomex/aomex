import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} deve essere di tipo Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} deve essere di tipo ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Non ancora supportato {{validator}}',
  },
});
