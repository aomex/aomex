import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Neplatná veľkosť v bajtoch: {{value}}',
  invalid_duration: 'Neplatné trvanie: {{value}}',
});
