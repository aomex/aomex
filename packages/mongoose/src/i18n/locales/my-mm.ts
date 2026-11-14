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
  migration: {
    create: 'ရွှေ့ပြောင်းခြင်းဖိုင်ကို ဖန်တီးပါ။',
    up: 'ရွှေ့ပြောင်းခြင်းကို လုပ်ဆောင်ပါ။',
    down: 'နောက်ပြန်ရွှေ့ခြင်း။',
    file_not_found: 'ရွှေ့ပြောင်းခြင်းဖိုင် "{{file}}" မရှိပါ။',
    input_file_name: 'ကျေးဇူးပြု၍ ရွှေ့ပြောင်းခြင်း ဖိုင်အမည်ကို ထည့်ပါ-',
    file_created: 'ရွှေ့ပြောင်းခြင်းဖိုင်ကို "{{file}}" အောင်မြင်စွာ ဖန်တီးခဲ့သည်',
  },
});
