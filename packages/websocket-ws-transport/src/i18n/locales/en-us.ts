import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  invalid_frame: 'Invalid WebSocket frame',
});
