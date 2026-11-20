import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'kad credentials ir true, origin jānorāda skaidri (konkrēts origin, baltais saraksts vai funkcija, kas atgriež konkrētu origin); noklusējuma atspoguļošana nav atļauta',
  credentials_with_wildcard_origin:
    'kad credentials ir true, origin nedrīkst būt "*": pārlūkprogrammas noraida šo kombināciju; izmantojiet konkrētu origin, balto sarakstu vai funkciju, kas atgriež konkrētu origin',
});
