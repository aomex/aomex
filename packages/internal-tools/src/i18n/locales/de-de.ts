import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Ungültige Byte-Größe: {{value}}',
  invalid_duration: 'Ungültige Dauer: {{value}}',
});
