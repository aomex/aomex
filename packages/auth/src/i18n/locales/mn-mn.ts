import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-mn */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Сесс үүсгэж чадсангүй: бичих олон оролдлого амжилтгүй болсон, хадгалах адаптерийг шалгана уу',
  session_max_age_invalid: 'cookie.maxAge эерэг тоо байх ёстой (секундээр)',
});
