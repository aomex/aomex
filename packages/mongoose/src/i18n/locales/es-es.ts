import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} debe ser del tipo Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} debe ser del tipo ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Aún no es compatible {{validator}}',
  },
});
