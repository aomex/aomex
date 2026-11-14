import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}}는 Decimal128 유형이어야 합니다.',
    },
    objectId: {
      must_be_objectId: '{{label}}는 ObjectId 유형이어야 합니다.',
    },
  },
  mongoose: {
    unsupported_validator: '아직 지원되지 않습니다 {{validator}}',
  },
  migration: {
    create: '마이그레이션 파일 생성',
    up: '마이그레이션 실행',
    down: '롤백 마이그레이션',
    file_not_found: '마이그레이션 파일 "{{file}}"가 존재하지 않습니다.',
    input_file_name: '마이그레이션 파일 이름을 입력하십시오:',
    file_created: '마이그레이션 파일 "{{file}}"이(가) 성공적으로 생성되었습니다.',
  },
});
