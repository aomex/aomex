import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ha de ser del tipus Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} ha de ser del tipus ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: "Encara no s'admet {{validator}}",
  },
});
