import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} Ondalıq128 tipli olmalıdır',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId tipli olmalıdır',
    },
  },
  mongoose: {
    unsupported_validator: 'Hələ {{validator}} dəstəklənmir',
  },
});
