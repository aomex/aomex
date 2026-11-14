import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'مطلوب {{label}}',
    array: {
      must_be_array: 'يجب أن يكون {{label}} مصفوفة',
      length_not_in_range: 'طول صفيف {{label}} ليس ضمن النطاق المحدد',
      not_unique: 'لا يمكن تكرار عناصر الصفيف {{label}}',
    },
    boolean: {
      must_be_boolean: 'يجب أن تكون {{label}} قيمة منطقية',
    },
    buffer: {
      must_be_buffer: 'يجب أن يكون {{label}} مخزنًا مؤقتًا',
    },
    stream: {
      must_be_stream: 'يجب أن يكون {{label}} دفقًا',
    },
    date: {
      must_be_date: 'يجب أن يكون {{label}} تاريخًا',
      not_in_range: '{{label}} ليس ضمن النطاق الزمني المسموح به',
    },
    number: {
      must_be_number: 'يجب أن يكون {{label}} رقمًا',
      must_be_integer: 'يجب أن يكون {{label}} عددًا صحيحًا',
      must_be_bigint: 'يجب أن يكون {{label}} BigInt',
      not_in_range: 'يتجاوز {{label}} نطاق القيمة المسموح به',
    },
    string: {
      must_be_string: 'يجب أن يكون {{label}} سلسلة',
      must_be_email: 'يجب أن يكون {{label}} بتنسيق البريد الإلكتروني',
      must_be_hash: 'يجب أن يكون {{label}} بتنسيق التجزئة',
      must_be_ip: 'يجب أن يكون {{label}} عنوان IP{{versions}}',
      must_be_ulid: 'يجب أن يكون {{label}} بتنسيق ULID',
      must_be_uuid: 'يجب أن يكون {{label}} بتنسيق UUID{{versions}}',
      length_not_in_range: 'طول {{label}} لا يلبي المتطلبات',
      not_match_pattern: '{{label}} لا يتوافق مع القواعد',
    },
    object: {
      must_be_object: 'يجب أن يكون {{label}} كائنًا',
    },
    enum: {
      not_in_range: '{{label}} ليس في نطاق التعداد',
      only_support_string_number_boolean:
        'يمكن أن تكون قيم التعداد عبارة عن سلاسل وأرقام وقيم منطقية فقط',
      value_can_not_be_empty: 'لا يمكن أن تكون قيمة التعداد قيمة فارغة "{{item}}"',
      ranges_can_not_be_empty: 'لا يمكن أن يكون نطاق التعداد فارغاً',
      default_not_in_range: 'القيمة الافتراضية "{{item}}" ليست في نطاق التعداد',
    },
    literal: {
      not_match: '{{label}} ليست القيمة المحددة',
      unsupported_value: 'يدعم فقط السلاسل والأرقام والقيم المنطقية والصفرية',
    },
    one_of: {
      not_match_rule: '{{label}} لا يتوافق مع القواعد',
      match_multiple_rule: 'يتوافق {{label}} مع العديد من القواعد',
    },
    any_of: {
      not_match_rule: '{{label}} لا يتوافق مع القواعد',
    },
    all_of: {
      not_match_all: '{{label}} لا يفي بجميع القواعد',
    },
    url: {
      must_be_url: 'يجب أن يكون {{label}} بتنسيق URL',
      unsupported_scheme: 'يحتوي {{label}} على بروتوكول URL غير مدعوم: {{scheme}}',
    },
  },
});
