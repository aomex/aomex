import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: 'Caithfidh {{label}} a bheith den chineál Deachúil128',
    },
    objectId: {
      must_be_objectId: 'Caithfidh {{label}} a bheith de chineál ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Gan tacaíocht fós {{validator}}',
  },
});
