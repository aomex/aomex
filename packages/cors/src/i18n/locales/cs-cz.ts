import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'když je credentials true, musí být origin nastaven výslovně (konkrétní origin, whitelist nebo funkce vracející konkrétní origin); výchozí reflexe není povolena',
  credentials_with_wildcard_origin:
    'když je credentials true, nesmí být origin "*": prohlížeče tuto kombinaci nepřijímají; použijte konkrétní origin, whitelist nebo funkci vracející konkrétní origin',
});
