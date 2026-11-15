import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} diperlukan',
    array: {
      must_be_array: '{{label}} harus berupa array',
      length_not_in_range:
        'Panjang array {{label}} tidak berada dalam rentang yang ditentukan',
      not_unique: 'Elemen array {{label}} tidak dapat diulang',
    },
    boolean: {
      must_be_boolean: '{{label}} harus berupa nilai Boolean',
    },
    buffer: {
      must_be_buffer: '{{label}} harus menjadi Penyangga',
    },
    stream: {
      must_be_stream: '{{label}} harus berupa Aliran',
    },
    date: {
      must_be_date: '{{label}} harus berupa kencan',
      not_in_range: '{{label}} tidak berada dalam rentang waktu yang diizinkan',
    },
    number: {
      must_be_number: '{{label}} harus berupa angka',
      must_be_integer: '{{label}} harus berupa bilangan bulat',
      must_be_bigint: '{{label}} harus berupa BigInt',
      must_be_decimal: '{{label}} harus berupa Decimal',
      not_in_range: '{{label}} melebihi rentang nilai yang diizinkan',
    },
    string: {
      must_be_string: '{{label}} harus berupa string',
      must_be_email: '{{label}} harus dalam format email',
      must_be_hash: '{{label}} harus dalam format hash',
      must_be_ip: '{{label}} harus berupa alamat IP{{versions}}',
      must_be_ulid: '{{label}} harus dalam format ULID',
      must_be_uuid: '{{label}} harus dalam format UUID{{versions}}',
      length_not_in_range: 'Panjang {{label}} tidak memenuhi persyaratan',
      not_match_pattern: '{{label}} tidak mematuhi aturan',
    },
    object: {
      must_be_object: '{{label}} harus berupa objek',
    },
    enum: {
      not_in_range: '{{label}} tidak berada dalam rentang pencacahan',
      only_support_string_number_boolean:
        'Nilai enumerasi hanya dapat berupa string, angka, dan nilai Boolean',
      value_can_not_be_empty: 'Nilai enumerasi tidak boleh berupa nilai null "{{item}}"',
      ranges_can_not_be_empty: 'Rentang enumerasi tidak boleh kosong',
      default_not_in_range: 'Nilai default "{{item}}" tidak ada dalam rentang enumerasi',
    },
    literal: {
      not_match: '{{label}} bukan nilai yang ditentukan',
      unsupported_value: 'Hanya mendukung string, angka, boolean, dan null',
    },
    one_of: {
      not_match_rule: '{{label}} tidak mematuhi aturan',
      match_multiple_rule: '{{label}} mematuhi banyak aturan',
    },
    any_of: {
      not_match_rule: '{{label}} tidak mematuhi aturan',
    },
    all_of: {
      not_match_all: '{{label}} tidak memenuhi semua aturan',
    },
    url: {
      must_be_url: '{{label}} harus dalam format URL',
      unsupported_scheme: '{{label}} berisi protokol URL yang tidak didukung: {{scheme}}',
    },
  },
});
