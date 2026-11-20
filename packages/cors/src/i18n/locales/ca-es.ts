import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    "quan credentials és true, origin s'ha de configurar explícitament (origen concret, llista blanca o funció que retorni un origen concret); la reflexió per defecte no és permesa",
  credentials_with_wildcard_origin:
    'quan credentials és true, origin no pot ser "*": els navegadors rebutgen aquesta combinació; useu un origen concret, una llista blanca o una funció que retorni un origen concret',
});
