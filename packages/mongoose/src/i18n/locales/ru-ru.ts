import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} должен иметь тип Decimal128.',
    },
    objectId: {
      must_be_objectId: '{{label}} должен иметь тип ObjectId.',
    },
  },
  mongoose: {
    unsupported_validator: 'Пока не поддерживается {{validator}}',
  },
});
