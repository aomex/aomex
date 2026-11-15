import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} ಅಗತ್ಯವಿದೆ',
    array: {
      must_be_array: '{{label}} ಒಂದು ಶ್ರೇಣಿಯಾಗಿರಬೇಕು',
      length_not_in_range: '{{label}} ರಚನೆಯ ಉದ್ದವು ನಿರ್ದಿಷ್ಟಪಡಿಸಿದ ವ್ಯಾಪ್ತಿಯಲ್ಲಿಲ್ಲ',
      not_unique: '{{label}} ರಚನೆಯ ಅಂಶಗಳನ್ನು ಪುನರಾವರ್ತಿಸಲಾಗುವುದಿಲ್ಲ',
    },
    boolean: {
      must_be_boolean: '{{label}} ಬೂಲಿಯನ್ ಮೌಲ್ಯವಾಗಿರಬೇಕು',
    },
    buffer: {
      must_be_buffer: '{{label}} ಬಫರ್ ಆಗಿರಬೇಕು',
    },
    stream: {
      must_be_stream: '{{label}} ಸ್ಟ್ರೀಮ್ ಆಗಿರಬೇಕು',
    },
    date: {
      must_be_date: '{{label}} ದಿನಾಂಕವಾಗಿರಬೇಕು',
      not_in_range: '{{label}} ಅನುಮತಿಸಲಾದ ಸಮಯದ ವ್ಯಾಪ್ತಿಯಲ್ಲಿಲ್ಲ',
    },
    number: {
      must_be_number: '{{label}} ಒಂದು ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು',
      must_be_integer: '{{label}} ಒಂದು ಪೂರ್ಣಾಂಕವಾಗಿರಬೇಕು',
      must_be_bigint: '{{label}} ಒಂದು BigInt ಆಗಿರಬೇಕು',
      must_be_decimal: '{{label}} ಒಂದು Decimal ಆಗಿರಬೇಕು',
      not_in_range: '{{label}} ಅನುಮತಿಸಲಾದ ಮೌಲ್ಯ ಶ್ರೇಣಿಯನ್ನು ಮೀರಿದೆ',
    },
    string: {
      must_be_string: '{{label}} ಒಂದು ಸ್ಟ್ರಿಂಗ್ ಆಗಿರಬೇಕು',
      must_be_email: '{{label}} ಇಮೇಲ್ ಫಾರ್ಮ್ಯಾಟ್‌ನಲ್ಲಿರಬೇಕು',
      must_be_hash: '{{label}} ಹ್ಯಾಶ್ ಸ್ವರೂಪದಲ್ಲಿರಬೇಕು',
      must_be_ip: '{{label}} IP{{versions}} ವಿಳಾಸವಾಗಿರಬೇಕು',
      must_be_ulid: '{{label}} ULID ಸ್ವರೂಪದಲ್ಲಿರಬೇಕು',
      must_be_uuid: '{{label}} UUID{{versions}} ಸ್ವರೂಪದಲ್ಲಿರಬೇಕು',
      length_not_in_range: '{{label}} ಉದ್ದವು ಅವಶ್ಯಕತೆಗಳನ್ನು ಪೂರೈಸುವುದಿಲ್ಲ',
      not_match_pattern: '{{label}} ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸುವುದಿಲ್ಲ',
    },
    object: {
      must_be_object: '{{label}} ಒಂದು ವಸ್ತುವಾಗಿರಬೇಕು',
    },
    enum: {
      not_in_range: '{{label}} ಎಣಿಕೆ ವ್ಯಾಪ್ತಿಯಲ್ಲಿಲ್ಲ',
      only_support_string_number_boolean:
        'ಎಣಿಕೆಯ ಮೌಲ್ಯಗಳು ಕೇವಲ ತಂತಿಗಳು, ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಬೂಲಿಯನ್ ಮೌಲ್ಯಗಳಾಗಿರಬಹುದು',
      value_can_not_be_empty: 'ಎಣಿಕೆಯ ಮೌಲ್ಯವು ಶೂನ್ಯ ಮೌಲ್ಯ "{{item}}" ಆಗಿರಬಾರದು',
      ranges_can_not_be_empty: 'ಎಣಿಕೆಯ ವ್ಯಾಪ್ತಿಯು ಖಾಲಿ ಇರುವಂತಿಲ್ಲ',
      default_not_in_range: 'ಡೀಫಾಲ್ಟ್ ಮೌಲ್ಯ "{{item}}" ಎಣಿಕೆ ವ್ಯಾಪ್ತಿಯಲ್ಲಿಲ್ಲ',
    },
    literal: {
      not_match: '{{label}} ನಿರ್ದಿಷ್ಟಪಡಿಸಿದ ಮೌಲ್ಯವಲ್ಲ',
      unsupported_value:
        'ಸ್ಟ್ರಿಂಗ್‌ಗಳು, ಸಂಖ್ಯೆಗಳು, ಬೂಲಿಯನ್‌ಗಳು ಮತ್ತು ಶೂನ್ಯವನ್ನು ಮಾತ್ರ ಬೆಂಬಲಿಸುತ್ತದೆ',
    },
    one_of: {
      not_match_rule: '{{label}} ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸುವುದಿಲ್ಲ',
      match_multiple_rule: '{{label}} ಅನೇಕ ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸುತ್ತದೆ',
    },
    any_of: {
      not_match_rule: '{{label}} ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸುವುದಿಲ್ಲ',
    },
    all_of: {
      not_match_all: '{{label}} ಎಲ್ಲಾ ನಿಯಮಗಳನ್ನು ಪೂರೈಸುವುದಿಲ್ಲ',
    },
    url: {
      must_be_url: '{{label}} URL ಸ್ವರೂಪದಲ್ಲಿರಬೇಕು',
      unsupported_scheme: '{{label}} ಬೆಂಬಲಿಸದ URL ಪ್ರೋಟೋಕಾಲ್ ಅನ್ನು ಹೊಂದಿದೆ: {{scheme}}',
    },
  },
});
