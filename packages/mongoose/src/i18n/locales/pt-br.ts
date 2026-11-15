import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} deve ser do tipo Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} deve ser do tipo ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Ainda não suportado {{validator}}',
  },
});
