import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} behar da',
    array: {
      must_be_array: '{{label}} array bat izan behar du',
      length_not_in_range: '{{label}} arrayaren luzera ez dago zehaztutako barrutian',
      not_unique: '{{label}} array-elementuak ezin dira errepikatu',
    },
    boolean: {
      must_be_boolean: '{{label}} balio boolearra izan behar du',
    },
    buffer: {
      must_be_buffer: '{{label}} Buffer izan behar du',
    },
    stream: {
      must_be_stream: '{{label}} Stream izan behar du',
    },
    date: {
      must_be_date: '{{label}} data bat izan behar du',
      not_in_range: '{{label}} ez dago baimendutako denbora tartean',
    },
    number: {
      must_be_number: '{{label}} zenbaki bat izan behar du',
      must_be_integer: '{{label}} zenbaki oso bat izan behar du',
      must_be_bigint: '{{label}} BigInt bat izan behar du',
      must_be_decimal: '{{label}} Decimal bat izan behar du',
      not_in_range: '{{label}} baimendutako balio-tartea gainditzen du',
    },
    string: {
      must_be_string: '{{label}} kate bat izan behar du',
      must_be_email: '{{label}} posta elektronikoaren formatuan egon behar du',
      must_be_hash: '{{label}} hash formatuan egon behar du',
      must_be_ip: '{{label}} IP{{versions}} helbidea izan behar du',
      must_be_ulid: '{{label}} ULID formatuan egon behar du',
      must_be_uuid: '{{label}} UUID{{versions}} formatuan egon behar du',
      length_not_in_range: '{{label}} luzerak ez ditu baldintzak betetzen',
      not_match_pattern: '{{label}}-k ez ditu arauak betetzen',
    },
    object: {
      must_be_object: '{{label}} objektu bat izan behar du',
    },
    enum: {
      not_in_range: '{{label}} ez dago enumerazio barrutian',
      only_support_string_number_boolean:
        'Zenbaketa-balioak kateak, zenbakiak eta balio boolearrak izan daitezke soilik',
      value_can_not_be_empty: 'Zenbaketaren balioa ezin da izan "{{item}}" balio nulua',
      ranges_can_not_be_empty: 'Zenbaki-barrutia ezin da hutsik egon',
      default_not_in_range: '"{{item}}" balio lehenetsia ez dago enumerazio barrutian',
    },
    literal: {
      not_match: '{{label}} ez da zehaztutako balioa',
      unsupported_value: 'Kateak, zenbakiak, boolearrak eta nuluak soilik onartzen ditu',
    },
    one_of: {
      not_match_rule: '{{label}}-k ez ditu arauak betetzen',
      match_multiple_rule: '{{label}}-k arau asko betetzen ditu',
    },
    any_of: {
      not_match_rule: '{{label}}-k ez ditu arauak betetzen',
    },
    all_of: {
      not_match_all: '{{label}}-k ez ditu arau guztiak betetzen',
    },
    url: {
      must_be_url: '{{label}} URL formatuan egon behar du',
      unsupported_scheme:
        '{{label}}-k onartzen ez den URL protokolo bat dauka: {{scheme}}',
    },
  },
});
