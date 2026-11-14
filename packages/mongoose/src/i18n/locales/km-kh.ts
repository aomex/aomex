import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ត្រូវតែជាប្រភេទ Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} ត្រូវតែជាប្រភេទ ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'មិនទាន់គាំទ្រ {{validator}} នៅឡើយទេ',
  },
  migration: {
    create: 'បង្កើតឯកសារចំណាកស្រុក',
    up: 'អនុវត្តការធ្វើចំណាកស្រុក',
    down: 'ការធ្វើចំណាកស្រុកវិលត្រឡប់មកវិញ',
    file_not_found: 'ឯកសារ​ចំណាកស្រុក "{{file}}" មិនមានទេ។',
    input_file_name: 'សូមបញ្ចូលឈ្មោះឯកសារផ្ទេរប្រាក់៖',
    file_created: 'ឯកសារផ្លាស់ប្តូរត្រូវបានបង្កើតដោយជោគជ័យ "{{file}}"',
  },
});
