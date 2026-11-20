import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'keď je credentials true, musí byť origin nastavený výslovne (konkrétny origin, whitelist alebo funkcia vracajúca konkrétny origin); predvolená reflexia nie je povolená',
  credentials_with_wildcard_origin:
    'keď je credentials true, origin nesmie byť "*": prehliadače túto kombináciu neprijímajú; použite konkrétny origin, whitelist alebo funkciu vracajúcu konkrétny origin',
});
