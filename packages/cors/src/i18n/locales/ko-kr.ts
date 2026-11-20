import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials가 true일 때는 origin을 명시적으로 설정해야 합니다(구체적인 출처, 화이트리스트, 또는 구체적인 출처를 반환하는 함수). 기본 반사는 허용되지 않습니다',
  credentials_with_wildcard_origin:
    'credentials가 true일 때 origin을 "*"로 설정할 수 없습니다: 브라우저는 이 조합을 허용하지 않습니다. 구체적인 출처, 화이트리스트, 또는 구체적인 출처를 반환하는 함수로 변경하세요',
});
