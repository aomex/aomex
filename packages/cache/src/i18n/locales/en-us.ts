import { I18n } from '@aomex/core';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  wrong_type: 'wrong kind of value',
  not_integer: 'value is not an integer',
});
