import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} talab qilinadi',
    array: {
      must_be_array: "{{label}} massiv bo'lishi kerak",
      length_not_in_range: '{{label}} massiv uzunligi belgilangan diapazonda emas',
      not_unique: "{{label}} massiv elementlarini takrorlab bo'lmaydi",
    },
    boolean: {
      must_be_boolean: "{{label}} mantiqiy qiymat bo'lishi kerak",
    },
    buffer: {
      must_be_buffer: "{{label}} Bufer bo'lishi kerak",
    },
    stream: {
      must_be_stream: '{{label}} Stream boʻlishi kerak',
    },
    date: {
      must_be_date: "{{label}} sana bo'lishi kerak",
      not_in_range: "{{label}} ruxsat etilgan vaqt oralig'ida emas",
    },
    number: {
      must_be_number: "{{label}} raqam bo'lishi kerak",
      must_be_integer: "{{label}} butun son bo'lishi kerak",
      must_be_bigint: "{{label}} BigInt bo'lishi kerak",
      not_in_range: "{{label}} ruxsat etilgan qiymat oralig'idan oshib ketadi",
    },
    string: {
      must_be_string: '{{label}} qator boʻlishi kerak',
      must_be_email: "{{label}} elektron pochta formatida bo'lishi kerak",
      must_be_hash: "{{label}} xesh formatida bo'lishi kerak",
      must_be_ip: '{{label}} IP{{versions}} manzili boʻlishi kerak',
      must_be_ulid: "{{label}} ULID formatida bo'lishi kerak",
      must_be_uuid: '{{label}} UUID{{versions}} formatida bo‘lishi kerak',
      length_not_in_range: '{{label}} uzunligi talablarga javob bermaydi',
      not_match_pattern: '{{label}} qoidalarga mos kelmaydi',
    },
    object: {
      must_be_object: "{{label}} ob'ekt bo'lishi kerak",
    },
    enum: {
      not_in_range: "{{label}} ro'yxatga olish oralig'ida emas",
      only_support_string_number_boolean:
        "Sanoq qiymatlari faqat satrlar, raqamlar va mantiqiy qiymatlar bo'lishi mumkin",
      value_can_not_be_empty:
        'Ro\'yxat qiymati "{{item}}" null qiymati bo\'lishi mumkin emas',
      ranges_can_not_be_empty: "Ro'yxatga olish oralig'i bo'sh bo'lishi mumkin emas",
      default_not_in_range:
        'Standart qiymat "{{item}}" ro\'yxatga olish oralig\'ida emas',
    },
    literal: {
      not_match: '{{label}} belgilangan qiymat emas',
      unsupported_value:
        "Faqat satrlarni, raqamlarni, mantiqiy va nullni qo'llab-quvvatlaydi",
    },
    one_of: {
      not_match_rule: '{{label}} qoidalarga mos kelmaydi',
      match_multiple_rule: "{{label}} ko'plab qoidalarga mos keladi",
    },
    any_of: {
      not_match_rule: '{{label}} qoidalarga mos kelmaydi',
    },
    all_of: {
      not_match_all: '{{label}} barcha qoidalarga javob bermaydi',
    },
    url: {
      must_be_url: '{{label}} URL formatida boʻlishi kerak',
      unsupported_scheme:
        '{{label}} tarkibida qo‘llab-quvvatlanmaydigan URL protokoli mavjud: {{scheme}}',
    },
  },
});
