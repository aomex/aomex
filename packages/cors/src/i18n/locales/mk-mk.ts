import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'кога credentials е true, origin мора експлицитно да се постави (конкретен origin, бела листа или функција што враќа конкретен origin); стандардното одразување не е дозволено',
  credentials_with_wildcard_origin:
    'кога credentials е true, origin не смее да биде "*": прелистувачите не ја прифаќаат оваа комбинација; користете конкретен origin, бела листа или функција што враќа конкретен origin',
});
