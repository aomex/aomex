import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-kr */
export default I18n.satisfies(zh).define({
  session_create_failed:
    '세션을 만들 수 없습니다: 여러 번 쓰기에 실패했습니다. 스토리지 어댑터를 확인하세요',
  session_max_age_invalid: 'cookie.maxAge는 양수여야 합니다(단위: 초)',
});
