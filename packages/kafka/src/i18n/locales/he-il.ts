import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers לא יכול להיות ריק',
  empty_broker: 'brokers מכיל כתובת ריקה',
  empty_client_id: 'clientId לא יכול להיות ריק',
  empty_group_id: 'groupId לא יכול להיות ריק',
  empty_topic: 'שם הנושא לא יכול להיות ריק',
  invalid_topic_name: 'שם נושא לא חוקי: {{topic}}',
  topic_name_too_long: 'שם הנושא ארוך מדי: {{length}} > {{max}}',
  duplicate_topic: 'הנושא נרשם יותר מפעם אחת: {{topic}}',
  mixed_group_id: 'קריאת צריכה אחת יכולה לכלול רק groupId אחד',
  empty_consumers: 'לא נמצאו צרכני Kafka',
  already_consuming: 'צרכן כבר רץ',
  closed: 'חיבור Kafka סגור',
  message_too_large: 'גודל ההודעה חורג מהמגבלה: {{bytes}} > {{max}}',
  invalid_json: 'ההודעה אינה JSON חוקי',
  empty_message: 'גוף ההודעה ריק',
  encode_failed: 'לא ניתן לקודד את ההודעה כ-JSON',
  unknown_topic: 'התקבל נושא שאינו במנוי: {{topic}}',
  invalid_offset: 'היסט הודעה לא חוקי: {{offset}}',
  idempotent_requires_all_acks: 'כאשר יצרן אידמפוטנטי מופעל, acks חייב להיות -1',
  unsupported_sasl: 'מנגנון SASL שאינו נתמך: {{mechanism}}',
  unsupported_tls: 'לא ניתן להעביר את אפשרות TLS ללקוח: {{name}}',
  heartbeat_exceeds_session: 'מרווח פעימות הלב חייב להיות קטן מזמן הקצוב של הסשן',
});
