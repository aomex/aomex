import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-lt */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Nepavyko sukurti seanso: kelis kartus nepavyko įrašyti, patikrinkite saugojimo adapterį',
  session_max_age_invalid: 'cookie.maxAge turi būti teigiamas skaičius (sekundėmis)',
});
