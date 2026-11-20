import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'când credentials este true, origin trebuie setat explicit (origin concret, listă albă sau funcție care returnează un origin concret); reflexia implicită nu este permisă',
  credentials_with_wildcard_origin:
    'când credentials este true, origin nu poate fi "*": browserele resping această combinație; folosiți un origin concret, o listă albă sau o funcție care returnează un origin concret',
});
