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
});
