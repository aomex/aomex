import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-am */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Չհաջողվեց ստեղծել սեանս․ գրելու մի քանի փորձ ձախողվեց, ստուգեք պահման ադապտերը',
  session_max_age_invalid: 'cookie.maxAge պետք է լինի դրական թիվ (վայրկյաններով)',
});
