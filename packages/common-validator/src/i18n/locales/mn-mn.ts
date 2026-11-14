import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} шаардлагатай',
    array: {
      must_be_array: '{{label}} нь массив байх ёстой',
      length_not_in_range: '{{label}} массивын урт нь заасан хязгаарт багтахгүй байна',
      not_unique: '{{label}} массивын элементүүдийг давтах боломжгүй',
    },
    boolean: {
      must_be_boolean: '{{label}} нь Булийн утга байх ёстой',
    },
    buffer: {
      must_be_buffer: '{{label}} буфер байх ёстой',
    },
    stream: {
      must_be_stream: '{{label}} урсгал байх ёстой',
    },
    date: {
      must_be_date: '{{label}} бол болзоо байх ёстой',
      not_in_range: '{{label}} зөвшөөрөгдсөн хугацааны хүрээнд биш байна',
    },
    number: {
      must_be_number: '{{label}} тоо байх ёстой',
      must_be_integer: '{{label}} бүхэл тоо байх ёстой',
      must_be_bigint: '{{label}} нь BigInt байх ёстой',
      not_in_range: '{{label}} зөвшөөрөгдсөн утгын хязгаараас хэтэрсэн байна',
    },
    string: {
      must_be_string: '{{label}} нь мөр байх ёстой',
      must_be_email: '{{label}} имэйл форматтай байх ёстой',
      must_be_hash: '{{label}} хэш форматтай байх ёстой',
      must_be_ip: '{{label}} нь IP{{versions}} хаяг байх ёстой',
      must_be_ulid: '{{label}} нь ULID форматтай байх ёстой',
      must_be_uuid: '{{label}} UUID{{versions}} форматтай байх ёстой',
      length_not_in_range: '{{label}} урт нь шаардлага хангахгүй байна',
      not_match_pattern: '{{label}} дүрэм журмыг дагаж мөрддөггүй',
    },
    object: {
      must_be_object: '{{label}} нь объект байх ёстой',
    },
    enum: {
      not_in_range: '{{label}} тооллогын мужид ороогүй байна',
      only_support_string_number_boolean:
        'Тооцооллын утга нь зөвхөн мөр, тоо, логик утга байж болно',
      value_can_not_be_empty: 'Тооллогын утга нь "{{item}}" хоосон утгатай байж болохгүй',
      ranges_can_not_be_empty: 'Тооллогын хүрээ хоосон байж болохгүй',
      default_not_in_range: '"{{item}}" өгөгдмөл утга нь тоолох мужид байхгүй байна',
    },
    literal: {
      not_match: '{{label}} нь заасан утга биш байна',
      unsupported_value: 'Зөвхөн мөр, тоо, логик, null-г дэмждэг',
    },
    one_of: {
      not_match_rule: '{{label}} дүрэм журмыг дагаж мөрддөггүй',
      match_multiple_rule: '{{label}} нь олон дүрэм журмыг дагаж мөрддөг',
    },
    any_of: {
      not_match_rule: '{{label}} дүрэм журмыг дагаж мөрддөггүй',
    },
    all_of: {
      not_match_all: '{{label}} нь бүх дүрмийг дагаж мөрддөггүй',
    },
    url: {
      must_be_url: '{{label}} URL форматтай байх ёстой',
      unsupported_scheme:
        '{{label}} нь дэмжигдээгүй URL протоколыг агуулж байна: {{scheme}}',
    },
  },
});
