import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-kz */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Сеансты жасау мүмкін болмады: бірнеше жазу әрекеті сәтсіз аяқталды, сақтау адаптерін тексеріңіз',
  session_max_age_invalid: 'cookie.maxAge оң сан болуы керек (секундпен)',
});
