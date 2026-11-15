import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} ត្រូវបានទាមទារ',
    array: {
      must_be_array: '{{label}} ត្រូវតែជាអារេ',
      length_not_in_range: 'ប្រវែងអារេ {{label}} មិនស្ថិតក្នុងជួរដែលបានបញ្ជាក់ទេ។',
      not_unique: 'ធាតុអារេ {{label}} មិនអាចធ្វើម្តងទៀតបានទេ។',
    },
    boolean: {
      must_be_boolean: '{{label}} ត្រូវតែជាតម្លៃប៊ូលីន',
    },
    buffer: {
      must_be_buffer: '{{label}} ត្រូវតែជា Buffer',
    },
    stream: {
      must_be_stream: '{{label}} ត្រូវតែស្ទ្រីម',
    },
    date: {
      must_be_date: '{{label}} ត្រូវតែជាកាលបរិច្ឆេទ',
      not_in_range: '{{label}} មិនស្ថិតនៅក្នុងចន្លោះពេលដែលបានអនុញ្ញាតទេ។',
    },
    number: {
      must_be_number: '{{label}} ត្រូវតែជាលេខ',
      must_be_integer: '{{label}} ត្រូវតែជាចំនួនគត់',
      must_be_bigint: '{{label}} ត្រូវតែជា BigInt',
      must_be_decimal: '{{label}} ត្រូវតែជា Decimal',
      not_in_range: '{{label}} លើសពីជួរតម្លៃដែលអនុញ្ញាត',
    },
    string: {
      must_be_string: '{{label}} ត្រូវតែជាខ្សែអក្សរ',
      must_be_email: '{{label}} ត្រូវតែជាទម្រង់អ៊ីមែល',
      must_be_hash: '{{label}} ត្រូវតែជាទម្រង់សញ្ញា',
      must_be_ip: '{{label}} ត្រូវតែជាអាសយដ្ឋាន IP{{versions}}',
      must_be_ulid: '{{label}} ត្រូវតែជាទម្រង់ ULID',
      must_be_uuid: '{{label}} ត្រូវតែជាទម្រង់ UUID{{versions}}',
      length_not_in_range: 'ប្រវែង {{label}} មិនបំពេញតាមតម្រូវការ',
      not_match_pattern: '{{label}} មិនគោរពតាមច្បាប់',
    },
    object: {
      must_be_object: '{{label}} ត្រូវតែជាវត្ថុមួយ។',
    },
    enum: {
      not_in_range: '{{label}} មិនស្ថិតនៅក្នុងជួររាប់បញ្ចូលទេ។',
      only_support_string_number_boolean:
        'តម្លៃរាប់បញ្ចូលអាចជាខ្សែអក្សរ លេខ និងតម្លៃប៊ូលីន',
      value_can_not_be_empty: 'តម្លៃនៃការរាប់បញ្ចូលមិនអាចជាតម្លៃទទេ "{{item}}"',
      ranges_can_not_be_empty: 'ជួរ​រាប់​មិន​អាច​ទទេ',
      default_not_in_range: 'តម្លៃលំនាំដើម "{{item}}" មិនស្ថិតក្នុងជួររាប់បញ្ចូលទេ។',
    },
    literal: {
      not_match: '{{label}} មិនមែនជាតម្លៃដែលបានបញ្ជាក់ទេ។',
      unsupported_value: 'គាំទ្រតែខ្សែអក្សរ លេខ ប៊ូលីន និងទទេ',
    },
    one_of: {
      not_match_rule: '{{label}} មិនគោរពតាមច្បាប់',
      match_multiple_rule: '{{label}} អនុលោមតាមច្បាប់ជាច្រើន។',
    },
    any_of: {
      not_match_rule: '{{label}} មិនគោរពតាមច្បាប់',
    },
    all_of: {
      not_match_all: '{{label}} មិនគោរពតាមច្បាប់ទាំងអស់។',
    },
    url: {
      must_be_url: '{{label}} ត្រូវតែជាទម្រង់ URL',
      unsupported_scheme: '{{label}} មានពិធីការ URL ដែលមិនគាំទ្រ៖ {{scheme}}',
    },
  },
});
