import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  invalid_bytes: '유효하지 않은 바이트 크기: {{value}}',
  invalid_duration: '유효하지 않은 기간: {{value}}',
});
