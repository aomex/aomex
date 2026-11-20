import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-lv */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Neizdevās izveidot sesiju: vairāki rakstīšanas mēģinājumi neizdevās, pārbaudiet krātuves adapteri',
  session_max_age_invalid: 'cookie.maxAge jābūt pozitīvam skaitlim (sekundēs)',
});
