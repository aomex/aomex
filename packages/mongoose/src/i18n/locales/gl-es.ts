import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} debe ser do tipo Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} debe ser do tipo ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Aínda non é compatible {{validator}}',
  },
});
