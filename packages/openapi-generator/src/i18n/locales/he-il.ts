import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  initialize: 'מסמך אתחול',
  search_routers_files: 'חיפוש קבצי ניתוב',
  parse_routers: 'נתח מסלול',
  add_tag: 'הוסף תג',
  hand_fix_documentation: 'תיקון מסמכים באופן ידני',
  optimize_parameter: 'פרמטרי אופטימיזציה',
  save_to_file: 'לשמור לקובץ',
  validate: 'אמת את המסמך',
  help_summary: 'מחולל תיעוד OpenAPI v3',
  help_app_listen_tip:
    'הפרידו בין new WebApp ל־app.listen (או בצעו listen רק בקובץ הכניסה) כדי שייבוא ה־CLI לא יפעיל את השרת כתופעת לוואי',
  has_error: 'שגיאות {{error_count}}, אזהרות {{warning_count}}',
  no_error: 'ללא שגיאות',
});
