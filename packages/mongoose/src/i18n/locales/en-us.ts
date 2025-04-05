import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}}: must be Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}}: must be ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator} is not supported yet',
  },
});
