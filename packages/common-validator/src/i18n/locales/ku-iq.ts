import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} پێویستە',
    array: {
      must_be_array: '{{label}} دەبێت ڕیزبەندییەک بێت',
      length_not_in_range: 'درێژی ڕیزبەندی {{label}} لە مەودای دیاریکراودا نییە',
      not_unique: 'توخمەکانی ڕیزبەندی {{label}} ناتوانرێت دووبارە بکرێنەوە',
    },
    boolean: {
      must_be_boolean: '{{label}} دەبێت بەهایەکی بولی بێت',
    },
    buffer: {
      must_be_buffer: '{{label}} دەبێت Buffer بێت',
    },
    stream: {
      must_be_stream: '{{label}} دەبێت Stream بێت',
    },
    date: {
      must_be_date: '{{label}} دەبێت بەروار بێت',
      not_in_range: '{{label}} لە مەودای کاتی ڕێگەپێدراودا نییە',
    },
    number: {
      must_be_number: '{{label}} دەبێت ژمارەیەک بێت',
      must_be_integer: '{{label}} دەبێت ژمارەیەکی تەواو بێت',
      must_be_bigint: '{{label}} دەبێت BigInt بێت',
      not_in_range: '{{label}} مەودای بەهای ڕێگەپێدراو تێدەپەڕێنێت',
    },
    string: {
      must_be_string: '{{label}} دەبێت ڕستەیەک بێت',
      must_be_email: '{{label}} دەبێت بە شێوەی ئیمەیڵ بێت',
      must_be_hash: '{{label}} دەبێت بە شێوەی هاش بێت',
      must_be_ip: '{{label}} دەبێت ناونیشانی IP{{versions}} بێت',
      must_be_ulid: '{{label}} دەبێت بە شێوەی ULID بێت',
      must_be_uuid: '{{label}} دەبێت بە شێوەی UUID{{versions}} بێت',
      length_not_in_range: 'درێژی {{label}} مەرجەکانی تێدا نییە',
      not_match_pattern: '{{label}} پابەند نییە بە یاساکانەوە',
    },
    object: {
      must_be_object: '{{label}} دەبێت ئۆبژێکت بێت',
    },
    enum: {
      not_in_range: '{{label}} لە مەودای ژماردن نییە',
      only_support_string_number_boolean:
        'بەهاکانی ژماردن تەنها دەتوانن ڕستە، ژمارە و بەهاکانی بولی بن',
      value_can_not_be_empty: 'بەهای ژماردن ناتوانێت بەهایەکی پووچ بێت "{{item}}".',
      ranges_can_not_be_empty: 'مەودای ژماردن ناتوانێت بەتاڵ بێت',
      default_not_in_range: 'بەهای پێشوەختە "{{item}}" لە مەودای ژماردن نییە',
    },
    literal: {
      not_match: '{{label}} بەهای دیاریکراو نییە',
      unsupported_value: 'تەنها پشتگیری لە ڕستە و ژمارە و بولی و پووچ دەکات',
    },
    one_of: {
      not_match_rule: '{{label}} پابەند نییە بە یاساکانەوە',
      match_multiple_rule: '{{label}} پابەندە بە زۆرێک لە یاساکانەوە',
    },
    any_of: {
      not_match_rule: '{{label}} پابەند نییە بە یاساکانەوە',
    },
    all_of: {
      not_match_all: '{{label}} هەموو یاساکان بەدی ناهێنێت',
    },
    url: {
      must_be_url: '{{label}} دەبێت بە شێوەی URL بێت',
      unsupported_scheme:
        '{{label}} پرۆتۆکۆڵێکی URLی پشتگیری نەکراو لەخۆدەگرێت: {{scheme}}',
    },
  },
});
