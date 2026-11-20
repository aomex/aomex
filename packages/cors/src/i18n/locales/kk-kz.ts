import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true болғанда origin анық орнатылуы керек (нақты origin, ақ тізім немесе нақты origin қайтаратын функция); әдепкі шағылыстыруға тыйым салынады',
  credentials_with_wildcard_origin:
    'credentials true болғанда origin "*" болмауы керек: браузерлер бұл комбинацияны қабылдамайды; нақты origin, ақ тізім немесе нақты origin қайтаратын функцияны пайдаланыңыз',
});
