import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} သည် Decimal128 အမျိုးအစားဖြစ်ရမည်။',
    },
    objectId: {
      must_be_objectId: '{{label}} သည် ObjectId အမျိုးအစားဖြစ်ရပါမည်။',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} ကို မပံ့ပိုးရသေးပါ။',
  },
});
