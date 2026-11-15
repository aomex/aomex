import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} gereklidir',
    array: {
      must_be_array: '{{label}} bir dizi olmalıdır',
      length_not_in_range: '{{label}} dizi uzunluğu belirtilen aralıkta değil',
      not_unique: '{{label}} dizi elemanları tekrarlanamaz',
    },
    boolean: {
      must_be_boolean: '{{label}} bir Boolean değeri olmalıdır',
    },
    buffer: {
      must_be_buffer: '{{label}} Tampon olmalıdır',
    },
    stream: {
      must_be_stream: '{{label}} Akış olmalıdır',
    },
    date: {
      must_be_date: '{{label}} bir tarih olmalıdır',
      not_in_range: '{{label}} izin verilen zaman aralığında değil',
    },
    number: {
      must_be_number: '{{label}} bir sayı olmalıdır',
      must_be_integer: '{{label}} bir tam sayı olmalıdır',
      must_be_bigint: '{{label}} bir BigInt olmalı',
      must_be_decimal: '{{label}} bir Decimal olmalı',
      not_in_range: '{{label}} izin verilen değer aralığını aşıyor',
    },
    string: {
      must_be_string: '{{label}} bir dize olmalıdır',
      must_be_email: '{{label}} e-posta biçiminde olmalıdır',
      must_be_hash: '{{label}} karma biçiminde olmalıdır',
      must_be_ip: '{{label}} bir IP{{versions}} adresi olmalıdır',
      must_be_ulid: '{{label}} ULID biçiminde olmalıdır',
      must_be_uuid: '{{label}}, UUID{{versions}} biçiminde olmalıdır',
      length_not_in_range: '{{label}} uzunluğu gereksinimleri karşılamıyor',
      not_match_pattern: '{{label}} kurallara uymuyor',
    },
    object: {
      must_be_object: '{{label}} bir nesne olmalıdır',
    },
    enum: {
      not_in_range: '{{label}} numaralandırma aralığında değil',
      only_support_string_number_boolean:
        'Numaralandırma değerleri yalnızca dizeler, sayılar ve Boole değerleri olabilir',
      value_can_not_be_empty: 'Numaralandırma değeri "{{item}}" boş değeri olamaz',
      ranges_can_not_be_empty: 'Numaralandırma aralığı boş olamaz',
      default_not_in_range: 'Varsayılan değer "{{item}}" numaralandırma aralığında değil',
    },
    literal: {
      not_match: '{{label}} belirtilen değer değil',
      unsupported_value: "Yalnızca dizeleri, sayıları, boolean'ları ve null'u destekler",
    },
    one_of: {
      not_match_rule: '{{label}} kurallara uymuyor',
      match_multiple_rule: '{{label}} birçok kurala uygundur',
    },
    any_of: {
      not_match_rule: '{{label}} kurallara uymuyor',
    },
    all_of: {
      not_match_all: '{{label}} tüm kuralları karşılamıyor',
    },
    url: {
      must_be_url: '{{label}} URL biçiminde olmalıdır',
      unsupported_scheme:
        '{{label}}, desteklenmeyen bir URL protokolü içeriyor: {{scheme}}',
    },
  },
});
