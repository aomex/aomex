import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true denean, origin esplizituki konfiguratu behar da (jatorri zehatza, zerrenda zuria edo jatorri zehatza itzultzen duen funtzioa); islapen lehenetsia ez da onartzen',
  credentials_with_wildcard_origin:
    'credentials true denean, origin ezin da "*" izan: nabigatzaileek konbinazio hau baztertzen dute; erabili jatorri zehatza, zerrenda zuria edo jatorri zehatza itzultzen duen funtzioa',
});
