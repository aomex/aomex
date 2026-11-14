import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} دەبێت لە جۆری Decimal128 بێت',
    },
    objectId: {
      must_be_objectId: '{{label}} دەبێت لە جۆری ObjectId بێت',
    },
  },
  mongoose: {
    unsupported_validator: 'هێشتا پشتگیری نەکراوە {{validator}}',
  },
  migration: {
    create: 'دروستکردنی فایلێکی کۆچکردن',
    up: 'کۆچکردن جێبەجێ بکە',
    down: 'کۆچی ڕۆڵباک',
    file_not_found: 'پەڕگەی کۆچکردن "{{file}}" بوونی نییە',
    input_file_name: 'تکایە ناوی پەڕگەی کۆچکردنەکە بنووسە:',
    file_created: 'فایلە کۆچکردنەکە بە سەرکەوتوویی "{{file}}" دروستکرا.',
  },
});
