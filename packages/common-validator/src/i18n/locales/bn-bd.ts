import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} প্রয়োজন',
    array: {
      must_be_array: '{{label}} একটি অ্যারে হতে হবে',
      length_not_in_range: '{{label}} অ্যারের দৈর্ঘ্য নির্দিষ্ট সীমার মধ্যে নয়৷',
      not_unique: '{{label}} অ্যারে উপাদান পুনরাবৃত্তি করা যাবে না',
    },
    boolean: {
      must_be_boolean: '{{label}} একটি বুলিয়ান মান হতে হবে',
    },
    buffer: {
      must_be_buffer: '{{label}} অবশ্যই বাফার হতে হবে',
    },
    stream: {
      must_be_stream: '{{label}} স্ট্রিম হতে হবে',
    },
    date: {
      must_be_date: '{{label}} একটি তারিখ হতে হবে',
      not_in_range: '{{label}} অনুমোদিত সময়সীমার মধ্যে নেই',
    },
    number: {
      must_be_number: '{{label}} একটি সংখ্যা হতে হবে',
      must_be_integer: '{{label}} একটি পূর্ণসংখ্যা হতে হবে',
      must_be_bigint: '{{label}} একটি BigInt হতে হবে',
      not_in_range: '{{label}} অনুমোদিত মান পরিসীমা অতিক্রম করে',
    },
    string: {
      must_be_string: '{{label}} একটি স্ট্রিং হতে হবে',
      must_be_email: '{{label}} ইমেল বিন্যাসে হতে হবে',
      must_be_hash: '{{label}} হ্যাশ ফরম্যাটে হতে হবে',
      must_be_ip: '{{label}} একটি IP{{versions}} ঠিকানা হতে হবে',
      must_be_ulid: '{{label}} অবশ্যই ULID ফর্ম্যাটে হতে হবে',
      must_be_uuid: '{{label}} UUID{{versions}} ফর্ম্যাটে হতে হবে',
      length_not_in_range: '{{label}} দৈর্ঘ্য প্রয়োজনীয়তা পূরণ করে না',
      not_match_pattern: '{{label}} নিয়ম মেনে চলে না',
    },
    object: {
      must_be_object: '{{label}} একটি বস্তু হতে হবে',
    },
    enum: {
      not_in_range: '{{label}} গণনা পরিসরে নেই',
      only_support_string_number_boolean:
        'গণনার মান শুধুমাত্র স্ট্রিং, সংখ্যা এবং বুলিয়ান মান হতে পারে',
      value_can_not_be_empty: 'গণনার মান একটি শূন্য মান হতে পারে না "{{item}}"',
      ranges_can_not_be_empty: 'গণনার পরিসর খালি থাকতে পারে না',
      default_not_in_range: 'ডিফল্ট মান "{{item}}" গণনা পরিসরে নেই৷',
    },
    literal: {
      not_match: '{{label}} নির্দিষ্ট মান নয়',
      unsupported_value: 'শুধুমাত্র স্ট্রিং, সংখ্যা, বুলিয়ান এবং নাল সমর্থন করে',
    },
    one_of: {
      not_match_rule: '{{label}} নিয়ম মেনে চলে না',
      match_multiple_rule: '{{label}} অনেক নিয়ম মেনে চলে',
    },
    any_of: {
      not_match_rule: '{{label}} নিয়ম মেনে চলে না',
    },
    all_of: {
      not_match_all: '{{label}} সব নিয়ম পূরণ করে না',
    },
    url: {
      must_be_url: '{{label}} URL ফর্ম্যাটে হতে হবে',
      unsupported_scheme: '{{label}} একটি অসমর্থিত URL প্রোটোকল রয়েছে: {{scheme}}',
    },
  },
});
