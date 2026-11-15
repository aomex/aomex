import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: 'ЗЗ0ЗЗ мора бити типа Децимал128',
    },
    objectId: {
      must_be_objectId: 'ЗЗ0ЗЗ мора бити типа ОбјецтИд',
    },
  },
  mongoose: {
    unsupported_validator: 'Још увек није подржан ЗЗ0ЗЗ',
  },
});
