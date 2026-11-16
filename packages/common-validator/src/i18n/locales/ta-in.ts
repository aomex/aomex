import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} தேவை',
    array: {
      must_be_array: '{{label}} ஒரு வரிசையாக இருக்க வேண்டும்',
      length_not_in_range: '{{label}} வரிசை நீளம் குறிப்பிட்ட வரம்பிற்குள் இல்லை',
      not_unique: '{{label}} வரிசை உறுப்புகளை மீண்டும் செய்ய முடியாது',
    },
    boolean: {
      must_be_boolean: '{{label}} கண்டிப்பாக பூலியன் மதிப்பாக இருக்க வேண்டும்',
    },
    buffer: {
      must_be_buffer: '{{label}} கண்டிப்பாக இடையகமாக இருக்க வேண்டும்',
    },
    stream: {
      must_be_stream: '{{label}} ஸ்ட்ரீமாக இருக்க வேண்டும்',
    },
    date: {
      must_be_date: '{{label}} ஒரு தேதியாக இருக்க வேண்டும்',
      not_in_range: '{{label}} அனுமதிக்கப்பட்ட நேர வரம்பிற்குள் இல்லை',
    },
    number: {
      must_be_number: '{{label}} ஒரு எண்ணாக இருக்க வேண்டும்',
      must_be_integer: '{{label}} ஒரு முழு எண்ணாக இருக்க வேண்டும்',
      must_be_bigint: '{{label}} கண்டிப்பாக BigInt ஆக இருக்க வேண்டும்',
      must_be_decimal: '{{label}} கண்டிப்பாக Decimal ஆக இருக்க வேண்டும்',
      not_in_range: '{{label}} அனுமதிக்கப்பட்ட மதிப்பு வரம்பை மீறுகிறது',
    },
    string: {
      must_be_string: '{{label}} ஒரு சரமாக இருக்க வேண்டும்',
      must_be_email: '{{label}} மின்னஞ்சல் வடிவத்தில் இருக்க வேண்டும்',
      must_be_hash: '{{label}} ஹாஷ் வடிவத்தில் இருக்க வேண்டும்',
      must_be_ip: '{{label}} என்பது IP{{versions}} முகவரியாக இருக்க வேண்டும்',
      must_be_ulid: '{{label}} ULID வடிவத்தில் இருக்க வேண்டும்',
      must_be_uuid: '{{label}} கண்டிப்பாக UUID{{versions}} வடிவத்தில் இருக்க வேண்டும்',
      length_not_in_range: '{{label}} நீளம் தேவைகளைப் பூர்த்தி செய்யவில்லை',
      not_match_pattern: '{{label}} விதிகளுக்கு இணங்கவில்லை',
    },
    object: {
      must_be_object: '{{label}} ஒரு பொருளாக இருக்க வேண்டும்',
    },
    enum: {
      not_in_range: '{{label}} கணக்கீட்டு வரம்பில் இல்லை',
      only_support_string_number_boolean:
        'எண்ணியல் மதிப்புகள் சரங்கள், எண்கள் மற்றும் பூலியன் மதிப்புகளாக மட்டுமே இருக்க முடியும்',
      value_can_not_be_empty: 'கணக்கீட்டு மதிப்பு "{{item}}" என்ற பூஜ்ய மதிப்பாக இருக்கக்கூடாது',
      ranges_can_not_be_empty: 'கணக்கீட்டு வரம்பு காலியாக இருக்கக்கூடாது',
      default_not_in_range: 'இயல்புநிலை மதிப்பு "{{item}}" கணக்கீட்டு வரம்பில் இல்லை',
    },
    literal: {
      not_match: '{{label}} என்பது குறிப்பிடப்பட்ட மதிப்பு அல்ல',
      unsupported_value: 'சரங்கள், எண்கள், பூலியன்கள் மற்றும் பூஜ்யத்தை மட்டுமே ஆதரிக்கிறது',
    },
    one_of: {
      not_match_rule: '{{label}} விதிகளுக்கு இணங்கவில்லை',
      match_multiple_rule: '{{label}} பல விதிகளுக்கு இணங்குகிறது',
    },
    any_of: {
      not_match_rule: '{{label}} விதிகளுக்கு இணங்கவில்லை',
    },
    all_of: {
      not_match_all: '{{label}} அனைத்து விதிகளையும் பூர்த்தி செய்யவில்லை',
    },
    url: {
      must_be_url: '{{label}} URL வடிவத்தில் இருக்க வேண்டும்',
      unsupported_scheme: '{{label}} ஆதரிக்கப்படாத URL நெறிமுறையைக் கொண்டுள்ளது: {{scheme}}',
    },
  },
});
