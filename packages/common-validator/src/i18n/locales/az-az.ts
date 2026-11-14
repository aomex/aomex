import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} tələb olunur',
    array: {
      must_be_array: '{{label}} massiv olmalıdır',
      length_not_in_range: '{{label}} massivinin uzunluğu göstərilən diapazonda deyil',
      not_unique: '{{label}} massiv elementləri təkrarlana bilməz',
    },
    boolean: {
      must_be_boolean: '{{label}} Boolean dəyəri olmalıdır',
    },
    buffer: {
      must_be_buffer: '{{label}} Bufer olmalıdır',
    },
    stream: {
      must_be_stream: '{{label}} Yayım olmalıdır',
    },
    date: {
      must_be_date: '{{label}} tarix olmalıdır',
      not_in_range: '{{label}} icazə verilən vaxt aralığında deyil',
    },
    number: {
      must_be_number: '{{label}} nömrə olmalıdır',
      must_be_integer: '{{label}} tam ədəd olmalıdır',
      must_be_bigint: '{{label}} BigInt olmalıdır',
      not_in_range: '{{label}} icazə verilən dəyər diapazonunu keçir',
    },
    string: {
      must_be_string: '{{label}} sətir olmalıdır',
      must_be_email: '{{label}} e-poçt formatında olmalıdır',
      must_be_hash: '{{label}} hash formatında olmalıdır',
      must_be_ip: '{{label}} IP{{versions}} ünvanı olmalıdır',
      must_be_ulid: '{{label}} ULID formatında olmalıdır',
      must_be_uuid: '{{label}} UUID{{versions}} formatında olmalıdır',
      length_not_in_range: '{{label}} uzunluğu tələblərə cavab vermir',
      not_match_pattern: '{{label}} qaydalara uyğun gəlmir',
    },
    object: {
      must_be_object: '{{label}} obyekt olmalıdır',
    },
    enum: {
      not_in_range: '{{label}} sadalanma aralığında deyil',
      only_support_string_number_boolean:
        'Sadalama dəyərləri yalnız sətirlər, rəqəmlər və Boolean dəyərləri ola bilər',
      value_can_not_be_empty: 'Sadalanma dəyəri "{{item}}" null dəyəri ola bilməz',
      ranges_can_not_be_empty: 'Sadalama diapazonu boş ola bilməz',
      default_not_in_range: 'Standart dəyər "{{item}}" sadalama diapazonunda deyil',
    },
    literal: {
      not_match: '{{label}} göstərilən dəyər deyil',
      unsupported_value:
        'Yalnız sətirləri, rəqəmləri, booleanları və nullları dəstəkləyir',
    },
    one_of: {
      not_match_rule: '{{label}} qaydalara uyğun gəlmir',
      match_multiple_rule: '{{label}} bir çox qaydalara uyğundur',
    },
    any_of: {
      not_match_rule: '{{label}} qaydalara uyğun gəlmir',
    },
    all_of: {
      not_match_all: '{{label}} bütün qaydalara cavab vermir',
    },
    url: {
      must_be_url: '{{label}} URL formatında olmalıdır',
      unsupported_scheme:
        '{{label}} dəstəklənməyən URL protokolunu ehtiva edir: {{scheme}}',
    },
  },
});
