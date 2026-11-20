import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Taille en octets invalide : {{value}}',
  invalid_duration: 'Durée invalide : {{value}}',
});
