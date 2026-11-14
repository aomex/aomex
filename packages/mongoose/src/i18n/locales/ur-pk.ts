import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} Decimal128 قسم کا ہونا چاہیے۔',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId قسم کا ہونا چاہیے۔',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} ابھی تک تعاون یافتہ نہیں ہے۔',
  },
  migration: {
    create: 'مائیگریشن فائل بنائیں',
    up: 'ہجرت پر عمل کریں۔',
    down: 'رول بیک ہجرت',
    file_not_found: 'منتقلی کی فائل "{{file}}" موجود نہیں ہے۔',
    input_file_name: 'براہ کرم منتقلی فائل کا نام درج کریں:',
    file_created: 'منتقلی فائل "{{file}}" کامیابی کے ساتھ بنائی گئی تھی۔',
  },
});
