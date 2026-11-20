import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Dimensione in byte non valida: {{value}}',
  invalid_duration: 'Durata non valida: {{value}}',
});
