import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} mora biti tipa Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} mora biti tipa ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Še ni podprto {{validator}}',
  },
});
