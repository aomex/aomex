import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} ایک فائل ہونی چاہیے۔',
      too_large: '{{label}} فائل بہت بڑی ہے۔',
      unsupported_mimetype: '{{label}} کی فائل کی قسم تعاون یافتہ نہیں ہے۔',
      invalid_mimetype_token: 'غلط میڈیا قسم یا فائل ایکسٹینشن: {{token}}',
    },
  },
  response: {
    redirect: '{{url}} پر ری ڈائریکٹ ہو رہا ہے',
  },
});
