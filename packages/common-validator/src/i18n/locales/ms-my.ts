import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} diperlukan',
    array: {
      must_be_array: '{{label}} mestilah tatasusunan',
      length_not_in_range:
        'Panjang tatasusunan {{label}} tidak dalam julat yang ditentukan',
      not_unique: 'Elemen tatasusunan {{label}} tidak boleh diulang',
    },
    boolean: {
      must_be_boolean: '{{label}} mestilah nilai Boolean',
    },
    buffer: {
      must_be_buffer: '{{label}} mestilah Penampan',
    },
    stream: {
      must_be_stream: '{{label}} mestilah Strim',
    },
    date: {
      must_be_date: '{{label}} mestilah tarikh',
      not_in_range: '{{label}} tidak berada dalam julat masa yang dibenarkan',
    },
    number: {
      must_be_number: '{{label}} mestilah nombor',
      must_be_integer: '{{label}} mestilah integer',
      must_be_bigint: '{{label}} mestilah BigInt',
      must_be_decimal: '{{label}} mestilah Decimal',
      not_in_range: '{{label}} melebihi julat nilai yang dibenarkan',
    },
    string: {
      must_be_string: '{{label}} mestilah rentetan',
      must_be_email: '{{label}} mestilah dalam format e-mel',
      must_be_hash: '{{label}} mestilah dalam format cincang',
      must_be_ip: '{{label}} mestilah alamat IP{{versions}}',
      must_be_ulid: '{{label}} mestilah dalam format ULID',
      must_be_uuid: '{{label}} mestilah dalam format UUID{{versions}}',
      length_not_in_range: 'Panjang {{label}} tidak memenuhi keperluan',
      not_match_pattern: '{{label}} tidak mematuhi peraturan',
    },
    object: {
      must_be_object: '{{label}} mestilah objek',
    },
    enum: {
      not_in_range: '{{label}} tiada dalam julat penghitungan',
      only_support_string_number_boolean:
        'Nilai penghitungan hanya boleh berupa rentetan, nombor dan nilai Boolean',
      value_can_not_be_empty:
        'Nilai penghitungan tidak boleh menjadi nilai nol "{{item}}"',
      ranges_can_not_be_empty: 'Julat penghitungan tidak boleh kosong',
      default_not_in_range: 'Nilai lalai "{{item}}" tiada dalam julat penghitungan',
    },
    literal: {
      not_match: '{{label}} bukan nilai yang ditentukan',
      unsupported_value: 'Hanya menyokong rentetan, nombor, boolean dan nol',
    },
    one_of: {
      not_match_rule: '{{label}} tidak mematuhi peraturan',
      match_multiple_rule: '{{label}} mematuhi banyak peraturan',
    },
    any_of: {
      not_match_rule: '{{label}} tidak mematuhi peraturan',
    },
    all_of: {
      not_match_all: '{{label}} tidak memenuhi semua peraturan',
    },
    url: {
      must_be_url: '{{label}} mestilah dalam format URL',
      unsupported_scheme:
        '{{label}} mengandungi protokol URL yang tidak disokong: {{scheme}}',
    },
  },
});
