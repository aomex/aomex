import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'nuair is true é credentials, ní mór origin a shocrú go sainráite (origin nithiúil, liosta bán, nó feidhm a fhilleann origin nithiúil); ní cheadaítear machnamh réamhshocraithe',
  credentials_with_wildcard_origin:
    'nuair is true é credentials, ní féidir le origin a bheith "*": diúltaíonn brabhsálaithe an teaglaim seo; úsáid origin nithiúil, liosta bán, nó feidhm a fhilleann origin nithiúil',
});
