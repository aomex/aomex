import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} 는 파일이어야 합니다.',
      too_large: '{{label}} 파일이 너무 큽니다.',
      unsupported_mimetype: '{{label}} 파일 형식은 지원되지 않습니다.',
      invalid_mimetype_token: '잘못된 미디어 유형 또는 파일 확장명: {{token}}',
    },
  },
  response: {
    redirect: '{{url}} (으)로 리디렉션 중',
  },
});
