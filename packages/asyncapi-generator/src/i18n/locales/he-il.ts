import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  initialize: 'מסמך אתחול',
  search_channels_files: 'חיפוש קבצי Channel',
  parse_channels: 'ניתוח Channel',
  hand_fix_documentation: 'תיקון מסמכים באופן ידני',
  save_to_file: 'לשמור לקובץ',
  validate: 'אמת את המסמך',
  help_summary: 'מחולל תיעוד AsyncAPI 3',
  has_error: 'שגיאות {{error_count}}, אזהרות {{warning_count}}',
  no_error: 'ללא שגיאות',
});
