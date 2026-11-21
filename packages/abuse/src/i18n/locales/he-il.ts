import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'סיבת ניצול לרעה של משתמש לא ידועה: {{reason}}',
  unknown_ip_abuse_reason: 'סיבת ניצול לרעה של IP לא ידועה: {{reason}}',
  duplicate_user_abuse_reason: 'סיבת ניצול לרעה של משתמש כפולה: {{reason}}',
  duplicate_ip_abuse_reason: 'סיבת ניצול לרעה של IP כפולה: {{reason}}',
  missing_on_ban_user: 'חובה לספק onBanUser כאשר מוגדרות אסטרטגיות user-abuse',
  invalid_limit: 'limit חייב להיות מספר שלם חיובי, התקבל: {{limit}}',
  invalid_window: 'window חייב להיות משך זמן חיובי, התקבל: {{window}}',
  invalid_block_for: 'blockFor חייב להיות משך זמן חיובי, התקבל: {{blockFor}}',
  invalid_ban_for: 'banFor חייב להיות משך זמן חיובי, התקבל: {{banFor}}',
  empty_honeypot_paths: 'paths של אסטרטגיית honeypot לא יכול להיות ריק',
  empty_http_error_status_codes: 'statusCodes של אסטרטגיית http-error לא יכול להיות ריק',
});
