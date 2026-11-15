import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} आवश्यक आहे',
    array: {
      must_be_array: '{{label}} एक ॲरे असणे आवश्यक आहे',
      length_not_in_range: '{{label}} ॲरे लांबी निर्दिष्ट श्रेणीमध्ये नाही',
      not_unique: '{{label}} ॲरे घटकांची पुनरावृत्ती होऊ शकत नाही',
    },
    boolean: {
      must_be_boolean: '{{label}} हे बुलियन मूल्य असणे आवश्यक आहे',
    },
    buffer: {
      must_be_buffer: '{{label}} बफर असणे आवश्यक आहे',
    },
    stream: {
      must_be_stream: '{{label}} प्रवाह असणे आवश्यक आहे',
    },
    date: {
      must_be_date: '{{label}} ही तारीख असणे आवश्यक आहे',
      not_in_range: '{{label}} अनुमत कालावधीमध्ये नाही',
    },
    number: {
      must_be_number: '{{label}} एक संख्या असणे आवश्यक आहे',
      must_be_integer: '{{label}} पूर्णांक असणे आवश्यक आहे',
      must_be_bigint: '{{label}} एक BigInt असणे आवश्यक आहे',
      must_be_decimal: '{{label}} एक Decimal असणे आवश्यक आहे',
      not_in_range: '{{label}} अनुमत मूल्य श्रेणी ओलांडते',
    },
    string: {
      must_be_string: '{{label}} एक स्ट्रिंग असणे आवश्यक आहे',
      must_be_email: '{{label}} ईमेल स्वरूपात असणे आवश्यक आहे',
      must_be_hash: '{{label}} हॅश फॉरमॅटमध्ये असणे आवश्यक आहे',
      must_be_ip: '{{label}} हा IP{{versions}} पत्ता असणे आवश्यक आहे',
      must_be_ulid: '{{label}} ULID स्वरूपात असणे आवश्यक आहे',
      must_be_uuid: '{{label}} UUID{{versions}} फॉरमॅटमध्ये असणे आवश्यक आहे',
      length_not_in_range: '{{label}} लांबी आवश्यकता पूर्ण करत नाही',
      not_match_pattern: '{{label}} नियमांचे पालन करत नाही',
    },
    object: {
      must_be_object: '{{label}} एक ऑब्जेक्ट असणे आवश्यक आहे',
    },
    enum: {
      not_in_range: '{{label}} गणना श्रेणीमध्ये नाही',
      only_support_string_number_boolean:
        'गणन मूल्ये केवळ स्ट्रिंग, संख्या आणि बुलियन मूल्ये असू शकतात',
      value_can_not_be_empty: 'गणन मूल्य शून्य मूल्य "{{item}}" असू शकत नाही',
      ranges_can_not_be_empty: 'गणन श्रेणी रिकामी असू शकत नाही',
      default_not_in_range: 'डीफॉल्ट मूल्य "{{item}}" गणना श्रेणीमध्ये नाही',
    },
    literal: {
      not_match: '{{label}} निर्दिष्ट मूल्य नाही',
      unsupported_value: 'फक्त स्ट्रिंग्स, नंबर्स, बुलियन्स आणि नल ला सपोर्ट करते',
    },
    one_of: {
      not_match_rule: '{{label}} नियमांचे पालन करत नाही',
      match_multiple_rule: '{{label}} अनेक नियमांचे पालन करते',
    },
    any_of: {
      not_match_rule: '{{label}} नियमांचे पालन करत नाही',
    },
    all_of: {
      not_match_all: '{{label}} सर्व नियमांची पूर्तता करत नाही',
    },
    url: {
      must_be_url: '{{label}} URL फॉरमॅटमध्ये असणे आवश्यक आहे',
      unsupported_scheme: '{{label}} मध्ये एक असमर्थित URL प्रोटोकॉल आहे: {{scheme}}',
    },
  },
});
