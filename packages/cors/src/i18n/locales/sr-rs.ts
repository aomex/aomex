import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'када је credentials true, origin мора бити експлицитно подешен (конкретан origin, бела листа или функција која враћа конкретан origin); подразумевано одражавање није дозвољено',
  credentials_with_wildcard_origin:
    'када је credentials true, origin не сме бити "*": прегледачи не прихватају ту комбинацију; користите конкретан origin, белу листу или функцију која враћа конкретан origin',
});
