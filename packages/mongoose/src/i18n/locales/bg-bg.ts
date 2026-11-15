import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} трябва да е от тип Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} трябва да е от тип ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Все още не се поддържа {{validator}}',
  },
});
