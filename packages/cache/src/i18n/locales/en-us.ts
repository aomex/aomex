import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  wrong_type: 'The value has an incorrect type',
  not_integer: 'The value is not an integer',
  single_flight_no_result: 'singleFlight did not obtain a shared result',
});
