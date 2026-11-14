import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  send_message_timed_out: 'Telegram message send timed out',
});
