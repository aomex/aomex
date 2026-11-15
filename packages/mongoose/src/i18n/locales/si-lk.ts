import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} දශම 128 වර්ගයේ විය යුතුය',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId වර්ගයේ විය යුතුය',
    },
  },
  mongoose: {
    unsupported_validator: 'තවමත් {{validator}} සඳහා සහය නොදක්වයි',
  },
});
