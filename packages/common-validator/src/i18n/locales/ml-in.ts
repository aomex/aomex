import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} ആവശ്യമാണ്',
    array: {
      must_be_array: '{{label}} ഒരു അറേ ആയിരിക്കണം',
      length_not_in_range: '{{label}} അറേ ദൈർഘ്യം നിർദ്ദിഷ്ട പരിധിക്കുള്ളിലല്ല',
      not_unique: '{{label}} അറേ ഘടകങ്ങൾ ആവർത്തിക്കാൻ കഴിയില്ല',
    },
    boolean: {
      must_be_boolean: '{{label}} ഒരു ബൂളിയൻ മൂല്യമായിരിക്കണം',
    },
    buffer: {
      must_be_buffer: '{{label}} ബഫർ ആയിരിക്കണം',
    },
    stream: {
      must_be_stream: '{{label}} സ്ട്രീം ആയിരിക്കണം',
    },
    date: {
      must_be_date: '{{label}} ഒരു തീയതി ആയിരിക്കണം',
      not_in_range: '{{label}} അനുവദനീയമായ സമയ പരിധിക്കുള്ളിലല്ല',
    },
    number: {
      must_be_number: '{{label}} ഒരു സംഖ്യയായിരിക്കണം',
      must_be_integer: '{{label}} ഒരു പൂർണ്ണസംഖ്യയായിരിക്കണം',
      must_be_bigint: '{{label}} ഒരു BigInt ആയിരിക്കണം',
      must_be_decimal: '{{label}} ഒരു Decimal ആയിരിക്കണം',
      not_in_range: '{{label}} അനുവദനീയമായ മൂല്യ പരിധി കവിയുന്നു',
    },
    string: {
      must_be_string: '{{label}} ഒരു സ്ട്രിംഗ് ആയിരിക്കണം',
      must_be_email: '{{label}} ഇമെയിൽ ഫോർമാറ്റിൽ ആയിരിക്കണം',
      must_be_hash: '{{label}} ഹാഷ് ഫോർമാറ്റിൽ ആയിരിക്കണം',
      must_be_ip: '{{label}} ഒരു IP{{versions}} വിലാസമായിരിക്കണം',
      must_be_ulid: '{{label}} ULID ഫോർമാറ്റിലായിരിക്കണം',
      must_be_uuid: '{{label}} UUID{{versions}} ഫോർമാറ്റിൽ ആയിരിക്കണം',
      length_not_in_range: '{{label}} ദൈർഘ്യം ആവശ്യകതകൾ പാലിക്കുന്നില്ല',
      not_match_pattern: '{{label}} നിയമങ്ങൾ പാലിക്കുന്നില്ല',
    },
    object: {
      must_be_object: '{{label}} ഒരു വസ്തുവായിരിക്കണം',
    },
    enum: {
      not_in_range: '{{label}} എണ്ണൽ ശ്രേണിയിലല്ല',
      only_support_string_number_boolean:
        'എണ്ണൽ മൂല്യങ്ങൾ സ്ട്രിംഗുകൾ, അക്കങ്ങൾ, ബൂളിയൻ മൂല്യങ്ങൾ എന്നിവ മാത്രമായിരിക്കും',
      value_can_not_be_empty: 'എണ്ണൽ മൂല്യം "{{item}}" ഒരു ശൂന്യ മൂല്യമായിരിക്കരുത്',
      ranges_can_not_be_empty: 'എണ്ണൽ ശ്രേണി ശൂന്യമാക്കാൻ കഴിയില്ല',
      default_not_in_range: 'സ്ഥിരസ്ഥിതി മൂല്യം "{{item}}" എണ്ണൽ ശ്രേണിയിൽ ഇല്ല',
    },
    literal: {
      not_match: '{{label}} നിർദ്ദിഷ്ട മൂല്യമല്ല',
      unsupported_value:
        'സ്ട്രിംഗുകൾ, അക്കങ്ങൾ, ബൂലിയൻസ്, നൾ എന്നിവ മാത്രം പിന്തുണയ്ക്കുന്നു',
    },
    one_of: {
      not_match_rule: '{{label}} നിയമങ്ങൾ പാലിക്കുന്നില്ല',
      match_multiple_rule: '{{label}} നിരവധി നിയമങ്ങൾ പാലിക്കുന്നു',
    },
    any_of: {
      not_match_rule: '{{label}} നിയമങ്ങൾ പാലിക്കുന്നില്ല',
    },
    all_of: {
      not_match_all: '{{label}} എല്ലാ നിയമങ്ങളും പാലിക്കുന്നില്ല',
    },
    url: {
      must_be_url: '{{label}} URL ഫോർമാറ്റിലായിരിക്കണം',
      unsupported_scheme:
        '{{label}}-ൽ ഒരു പിന്തുണയ്ക്കാത്ത URL പ്രോട്ടോക്കോൾ അടങ്ങിയിരിക്കുന്നു: {{scheme}}',
    },
  },
});
