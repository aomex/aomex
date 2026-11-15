import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} musi być typu Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} musi być typu ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Jeszcze nieobsługiwane {{validator}}',
  },
});
