import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'երբ credentials-ը true է, origin-ը պետք է հստակ սահմանվի (կոնկրետ origin, սպիտակ ցուցակ կամ կոնկրետ origin վերադարձնող ֆունկցիա)․ լռելյայն արտացոլումը արգելված է',
  credentials_with_wildcard_origin:
    'երբ credentials-ը true է, origin-ը չի կարող լինել "*"․ դիտարկիչները չեն ընդունում այս համադրությունը․ օգտագործեք կոնկրետ origin, սպիտակ ցուցակ կամ կոնկրետ origin վերադարձնող ֆունկցիա',
});
