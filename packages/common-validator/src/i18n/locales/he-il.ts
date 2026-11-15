import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'נדרש {{label}}',
    array: {
      must_be_array: '{{label}} חייב להיות מערך',
      length_not_in_range: 'אורך מערך {{label}} אינו בטווח שצוין',
      not_unique: 'לא ניתן לחזור על רכיבי מערך {{label}}',
    },
    boolean: {
      must_be_boolean: '{{label}} חייב להיות ערך בוליאני',
    },
    buffer: {
      must_be_buffer: '{{label}} חייב להיות Buffer',
    },
    stream: {
      must_be_stream: '{{label}} חייב להיות Stream',
    },
    date: {
      must_be_date: '{{label}} חייב להיות תאריך',
      not_in_range: '{{label}} אינו בטווח הזמן המותר',
    },
    number: {
      must_be_number: '{{label}} חייב להיות מספר',
      must_be_integer: '{{label}} חייב להיות מספר שלם',
      must_be_bigint: '{{label}} חייב להיות BigInt',
      must_be_decimal: '{{label}} חייב להיות Decimal',
      not_in_range: '{{label}} חורג מטווח הערכים המותר',
    },
    string: {
      must_be_string: '{{label}} חייבת להיות מחרוזת',
      must_be_email: '{{label}} חייב להיות בפורמט דוא"ל',
      must_be_hash: '{{label}} חייב להיות בפורמט hash',
      must_be_ip: '{{label}} חייבת להיות כתובת IP{{versions}}',
      must_be_ulid: '{{label}} חייב להיות בפורמט ULID',
      must_be_uuid: '{{label}} חייב להיות בפורמט UUID{{versions}}',
      length_not_in_range: 'אורך {{label}} אינו עומד בדרישות',
      not_match_pattern: '{{label}} אינו תואם את הכללים',
    },
    object: {
      must_be_object: '{{label}} חייב להיות אובייקט',
    },
    enum: {
      not_in_range: '{{label}} אינו בטווח הספירה',
      only_support_string_number_boolean:
        'ערכי ספירה יכולים להיות רק מחרוזות, מספרים וערכים בוליאניים',
      value_can_not_be_empty: 'ערך הספירה אינו יכול להיות ערך ריק "{{item}}"',
      ranges_can_not_be_empty: 'טווח הספירה לא יכול להיות ריק',
      default_not_in_range: 'ערך ברירת המחדל "{{item}}" אינו בטווח הספירה',
    },
    literal: {
      not_match: '{{label}} אינו הערך שצוין',
      unsupported_value: 'תומך רק במחרוזות, מספרים, בוליאנים ו-null',
    },
    one_of: {
      not_match_rule: '{{label}} אינו תואם את הכללים',
      match_multiple_rule: '{{label}} תואם לכללים רבים',
    },
    any_of: {
      not_match_rule: '{{label}} אינו תואם את הכללים',
    },
    all_of: {
      not_match_all: '{{label}} לא עומד בכל הכללים',
    },
    url: {
      must_be_url: '{{label}} חייב להיות בפורמט כתובת URL',
      unsupported_scheme: '{{label}} מכיל פרוטוקול כתובת URL לא נתמך: {{scheme}}',
    },
  },
});
