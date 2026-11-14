import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} Decimal128 টাইপের হতে হবে',
    },
    objectId: {
      must_be_objectId: '{{label}} টাইপের ObjectId হতে হবে',
    },
  },
  mongoose: {
    unsupported_validator: 'এখনও {{validator}} সমর্থিত নয়৷',
  },
  migration: {
    create: 'মাইগ্রেশন ফাইল তৈরি করুন',
    up: 'মাইগ্রেশন চালান',
    down: 'রোলব্যাক মাইগ্রেশন',
    file_not_found: 'মাইগ্রেশন ফাইল "{{file}}" বিদ্যমান নেই৷',
    input_file_name: 'অনুগ্রহ করে মাইগ্রেশন ফাইলের নাম লিখুন:',
    file_created: 'মাইগ্রেশন ফাইল "{{file}}" সফলভাবে তৈরি করা হয়েছে',
  },
});
