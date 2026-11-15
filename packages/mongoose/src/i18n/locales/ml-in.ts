import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ഡെസിമൽ128 തരം ആയിരിക്കണം',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId തരത്തിലായിരിക്കണം',
    },
  },
  mongoose: {
    unsupported_validator: 'ഇതുവരെ {{validator}} പിന്തുണയ്ക്കുന്നില്ല',
  },
});
