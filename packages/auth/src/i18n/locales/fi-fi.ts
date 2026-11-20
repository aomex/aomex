import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-fi */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Istuntoa ei voitu luoda: useat kirjoitusyritykset epäonnistuivat, tarkista tallennussovitin',
  session_max_age_invalid: 'cookie.maxAge on oltava positiivinen luku (sekunteina)',
});
