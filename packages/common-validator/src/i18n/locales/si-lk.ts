import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} අවශ්‍යයි',
    array: {
      must_be_array: '{{label}} අරාවක් විය යුතුය',
      length_not_in_range: '{{label}} අරාව දිග නිශ්චිත පරාසය තුළ නැත',
      not_unique: '{{label}} අරා මූලද්‍රව්‍ය නැවත නැවත කළ නොහැක',
    },
    boolean: {
      must_be_boolean: '{{label}} Boolean අගයක් විය යුතුය',
    },
    buffer: {
      must_be_buffer: '{{label}} බෆරය විය යුතුය',
    },
    stream: {
      must_be_stream: '{{label}} Stream විය යුතුය',
    },
    date: {
      must_be_date: '{{label}} දිනයක් විය යුතුය',
      not_in_range: '{{label}} අවසර ලත් කාල පරාසය තුළ නොවේ',
    },
    number: {
      must_be_number: '{{label}} අංකයක් විය යුතුය',
      must_be_integer: '{{label}} පූර්ණ සංඛ්‍යාවක් විය යුතුය',
      must_be_bigint: '{{label}} BigInt එකක් විය යුතුය',
      must_be_decimal: '{{label}} Decimal එකක් විය යුතුය',
      not_in_range: '{{label}} අවසර ලත් අගය පරාසය ඉක්මවයි',
    },
    string: {
      must_be_string: '{{label}} තන්තුවක් විය යුතුය',
      must_be_email: '{{label}} ඊමේල් ආකෘතියෙන් විය යුතුය',
      must_be_hash: '{{label}} හැෂ් ආකෘතියෙන් විය යුතුය',
      must_be_ip: '{{label}} IP{{versions}} ලිපිනයක් විය යුතුය',
      must_be_ulid: '{{label}} ULID ආකෘතියෙන් විය යුතුය',
      must_be_uuid: '{{label}} UUID{{versions}} ආකෘතියෙන් විය යුතුය',
      length_not_in_range: '{{label}} දිග අවශ්‍යතා සපුරාලන්නේ නැත',
      not_match_pattern: '{{label}} නීතිරීතිවලට අනුකූල නොවේ',
    },
    object: {
      must_be_object: '{{label}} වස්තුවක් විය යුතුය',
    },
    enum: {
      not_in_range: '{{label}} ගණන් කිරීමේ පරාසයේ නැත',
      only_support_string_number_boolean:
        'ගණන් කිරීමේ අගයන් විය හැක්කේ තන්තු, සංඛ්‍යා සහ බූලියන් අගයන් පමණි',
      value_can_not_be_empty: 'ගණන් කිරීමේ අගය "{{item}}" ශුන්‍ය අගයක් විය නොහැක',
      ranges_can_not_be_empty: 'ගණන් කිරීමේ පරාසය හිස් විය නොහැක',
      default_not_in_range: 'පෙරනිමි අගය "{{item}}" ගණන් කිරීමේ පරාසයේ නොමැත',
    },
    literal: {
      not_match: '{{label}} නිශ්චිත අගය නොවේ',
      unsupported_value: 'තන්තු, අංක, බූලියන් සහ ශුන්‍ය සඳහා පමණක් සහය දක්වයි',
    },
    one_of: {
      not_match_rule: '{{label}} නීතිරීතිවලට අනුකූල නොවේ',
      match_multiple_rule: '{{label}} බොහෝ නීති වලට අනුකූල වේ',
    },
    any_of: {
      not_match_rule: '{{label}} නීතිරීතිවලට අනුකූල නොවේ',
    },
    all_of: {
      not_match_all: '{{label}} සියලු නීති සපුරාලන්නේ නැත',
    },
    url: {
      must_be_url: '{{label}} URL ආකෘතියෙන් තිබිය යුතුය',
      unsupported_scheme:
        '{{label}} හි සහාය නොදක්වන URL ප්‍රොටෝකෝලයක් අඩංගු වේ: {{scheme}}',
    },
  },
});
