import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: 'يجب أن يكون {{label}} من النوع Decimal128',
    },
    objectId: {
      must_be_objectId: 'يجب أن يكون {{label}} من النوع ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'غير معتمد حتى الآن {{validator}}',
  },
  migration: {
    create: 'إنشاء ملف الهجرة',
    up: 'تنفيذ الترحيل',
    down: 'الهجرة التراجعية',
    file_not_found: 'ملف الترحيل "{{file}}" غير موجود',
    input_file_name: 'الرجاء إدخال اسم ملف الترحيل:',
    file_created: 'تم إنشاء ملف الترحيل بنجاح "{{file}}"',
  },
});
