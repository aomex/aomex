import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} आवश्यक है',
    array: {
      must_be_array: '{{label}} एक सरणी होनी चाहिए',
      length_not_in_range: '{{label}} सरणी की लंबाई निर्दिष्ट सीमा के भीतर नहीं है',
      not_unique: '{{label}} सरणी तत्वों को दोहराया नहीं जा सकता',
    },
    boolean: {
      must_be_boolean: '{{label}} एक बूलियन मान होना चाहिए',
    },
    buffer: {
      must_be_buffer: '{{label}} बफर होना चाहिए',
    },
    stream: {
      must_be_stream: '{{label}} स्ट्रीम होना चाहिए',
    },
    date: {
      must_be_date: '{{label}} एक तारीख होनी चाहिए',
      not_in_range: '{{label}} अनुमत समय सीमा के भीतर नहीं है',
    },
    number: {
      must_be_number: '{{label}} एक संख्या होनी चाहिए',
      must_be_integer: '{{label}} एक पूर्णांक होना चाहिए',
      must_be_bigint: '{{label}} एक BigInt होना चाहिए',
      must_be_decimal: '{{label}} एक Decimal होना चाहिए',
      not_in_range: '{{label}} अनुमत मान सीमा से अधिक है',
    },
    string: {
      must_be_string: '{{label}} एक स्ट्रिंग होनी चाहिए',
      must_be_email: '{{label}} ईमेल प्रारूप में होना चाहिए',
      must_be_hash: '{{label}} हैश प्रारूप में होना चाहिए',
      must_be_ip: '{{label}} एक IP{{versions}} पता होना चाहिए',
      must_be_ulid: '{{label}} ULID प्रारूप में होना चाहिए',
      must_be_uuid: '{{label}} UUID{{versions}} प्रारूप में होना चाहिए',
      length_not_in_range: '{{label}} लंबाई आवश्यकताओं को पूरा नहीं करती',
      not_match_pattern: '{{label}} नियमों का पालन नहीं करता',
    },
    object: {
      must_be_object: '{{label}} एक वस्तु होनी चाहिए',
    },
    enum: {
      not_in_range: '{{label}} गणना सीमा में नहीं है',
      only_support_string_number_boolean:
        'गणना मान केवल स्ट्रिंग, संख्याएं और बूलियन मान हो सकते हैं',
      value_can_not_be_empty: 'गणना मान शून्य मान नहीं हो सकता "{{item}}"',
      ranges_can_not_be_empty: 'गणना सीमा खाली नहीं हो सकती',
      default_not_in_range: 'डिफ़ॉल्ट मान "{{item}}" गणना सीमा में नहीं है',
    },
    literal: {
      not_match: '{{label}} निर्दिष्ट मान नहीं है',
      unsupported_value: 'केवल स्ट्रिंग्स, संख्याओं, बूलियन और नल का समर्थन करता है',
    },
    one_of: {
      not_match_rule: '{{label}} नियमों का पालन नहीं करता',
      match_multiple_rule: '{{label}} कई नियमों का अनुपालन करता है',
    },
    any_of: {
      not_match_rule: '{{label}} नियमों का पालन नहीं करता',
    },
    all_of: {
      not_match_all: '{{label}} सभी नियमों को पूरा नहीं करता है',
    },
    url: {
      must_be_url: '{{label}} URL प्रारूप में होना चाहिए',
      unsupported_scheme:
        '{{label}} में एक असमर्थित यूआरएल प्रोटोकॉल शामिल है: {{scheme}}',
    },
  },
});
