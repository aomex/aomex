import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} må være av typen Desimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} må være av typen ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Ikke støttet ennå {{validator}}',
  },
});
