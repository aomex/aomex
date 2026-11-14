import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} आवश्यक छ',
    array: {
      must_be_array: '{{label}} एर्रे हुनुपर्छ',
      length_not_in_range: '{{label}} एरे लम्बाइ निर्दिष्ट दायरा भित्र छैन',
      not_unique: '{{label}} एरे तत्वहरू दोहोर्याउन सकिँदैन',
    },
    boolean: {
      must_be_boolean: '{{label}} बुलियन मान हुनुपर्छ',
    },
    buffer: {
      must_be_buffer: '{{label}} बफर हुनुपर्छ',
    },
    stream: {
      must_be_stream: '{{label}} स्ट्रिम हुनुपर्छ',
    },
    date: {
      must_be_date: '{{label}} मिति हुनुपर्छ',
      not_in_range: '{{label}} अनुमति दिइएको समय दायरा भित्र छैन',
    },
    number: {
      must_be_number: '{{label}} एउटा नम्बर हुनुपर्छ',
      must_be_integer: '{{label}} एक पूर्णांक हुनुपर्छ',
      must_be_bigint: '{{label}} एउटा BigInt हुनुपर्छ',
      not_in_range: '{{label}} ले अनुमति दिइएको मान दायरा नाघ्यो',
    },
    string: {
      must_be_string: '{{label}} एउटा स्ट्रिङ हुनुपर्छ',
      must_be_email: '{{label}} इमेल ढाँचामा हुनुपर्छ',
      must_be_hash: '{{label}} ह्यास ढाँचामा हुनुपर्छ',
      must_be_ip: '{{label}} IP{{versions}} ठेगाना हुनुपर्छ',
      must_be_ulid: '{{label}} ULID ढाँचामा हुनुपर्छ',
      must_be_uuid: '{{label}} UUID{{versions}} ढाँचामा हुनुपर्छ',
      length_not_in_range: '{{label}} लम्बाइ आवश्यकताहरू पूरा गर्दैन',
      not_match_pattern: '{{label}} नियमहरूको पालना गर्दैन',
    },
    object: {
      must_be_object: '{{label}} एउटा वस्तु हुनुपर्छ',
    },
    enum: {
      not_in_range: '{{label}} गणना दायरामा छैन',
      only_support_string_number_boolean:
        'गणना मानहरू केवल स्ट्रिङहरू, संख्याहरू, र बुलियन मानहरू हुन सक्छन्',
      value_can_not_be_empty: 'गणना मान शून्य मान "{{item}}" हुन सक्दैन।',
      ranges_can_not_be_empty: 'गणना दायरा खाली हुन सक्दैन',
      default_not_in_range: 'पूर्वनिर्धारित मान "{{item}}" गणना दायरामा छैन',
    },
    literal: {
      not_match: '{{label}} निर्दिष्ट मान होइन',
      unsupported_value: 'केवल स्ट्रिङ, संख्या, बुलियन, र नल समर्थन गर्दछ',
    },
    one_of: {
      not_match_rule: '{{label}} नियमहरूको पालना गर्दैन',
      match_multiple_rule: '{{label}} धेरै नियमहरूको पालना गर्दछ',
    },
    any_of: {
      not_match_rule: '{{label}} नियमहरूको पालना गर्दैन',
    },
    all_of: {
      not_match_all: '{{label}} सबै नियमहरू पूरा गर्दैन',
    },
    url: {
      must_be_url: '{{label}} URL ढाँचामा हुनुपर्छ',
      unsupported_scheme: '{{label}} ले असमर्थित URL प्रोटोकल समावेश गर्दछ: {{scheme}}',
    },
  },
});
