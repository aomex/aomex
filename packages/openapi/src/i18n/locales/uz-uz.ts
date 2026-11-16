import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  initialize: 'ishga tushirish hujjati',
  search_routers_files: 'Marshrutlash fayllarini qidirish',
  parse_routers: 'marshrutni tahlil qilish',
  add_tag: "Teg qo'shing",
  hand_fix_documentation: "Hujjatlarni qo'lda ta'mirlash",
  optimize_parameter: 'Optimallashtirish parametrlari',
  save_to_file: 'faylga saqlang',
  validate: 'Hujjatni tasdiqlang',
  help_summary: 'OpenAPI v3 hujjat generatori',
  help_app_listen_tip:
    'new WebApp va app.listen ni ajrating (yoki faqat kirish faylida listen qiling), CLI import serverni yon ta’sir sifatida ishga tushirmasligi uchun',
  has_error: '{{error_count}} xatolar, {{warning_count}} ogohlantirishlari',
  no_error: "xatolar yo'q",
});
