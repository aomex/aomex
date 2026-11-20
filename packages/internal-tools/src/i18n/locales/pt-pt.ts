import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** pt-PT */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Tamanho em bytes inválido: {{value}}',
  invalid_duration: 'Duração inválida: {{value}}',
});
