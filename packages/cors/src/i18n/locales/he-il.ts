import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'כאשר credentials הוא true יש להגדיר origin במפורש (מקור קונקרטי, רשימת היתר או פונקציה שמחזירה מקור קונקרטי); השתקפות ברירת מחדל אסורה',
  credentials_with_wildcard_origin:
    'כאשר credentials הוא true אסור ש-origin יהיה "*": דפדפנים דוחים צירוף זה; השתמשו במקור קונקרטי, ברשימת היתר או בפונקציה שמחזירה מקור קונקרטי',
});
