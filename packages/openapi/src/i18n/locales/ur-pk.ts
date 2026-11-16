import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  initialize: 'ابتدائی دستاویز',
  search_routers_files: 'روٹنگ فائلیں تلاش کریں۔',
  parse_routers: 'راستے کا تجزیہ کریں',
  add_tag: 'ٹیگ شامل کریں۔',
  hand_fix_documentation: 'دستی طور پر دستاویزات کی مرمت کریں۔',
  optimize_parameter: 'اصلاح کے پیرامیٹرز',
  save_to_file: 'فائل میں محفوظ کریں۔',
  validate: 'دستاویز کی تصدیق کریں۔',
  help_summary: 'OpenAPI v3 دستاویزی جنریٹر',
  help_app_listen_tip:
    'app پاس کرتے وقت new WebApp اور app.listen کو الگ رکھیں (یا صرف انٹری فائل میں listen کریں)، تاکہ CLI import ضمنی اثر کے طور پر سرور شروع نہ کرے',
  has_error: '{{error_count}} غلطیاں، {{warning_count}} انتباہات',
  no_error: 'کوئی غلطیاں نہیں',
});
