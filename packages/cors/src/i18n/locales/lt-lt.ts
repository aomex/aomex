import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'kai credentials yra true, origin turi būti nustatyta aiškiai (konkretus origin, baltasis sąrašas arba konkretų origin grąžinanti funkcija); numatytasis atspindėjimas neleidžiamas',
  credentials_with_wildcard_origin:
    'kai credentials yra true, origin negali būti "*": naršyklės nepriima šio derinio; naudokite konkretų origin, baltąjį sąrašą arba funkciją, grąžinančią konkretų origin',
});
