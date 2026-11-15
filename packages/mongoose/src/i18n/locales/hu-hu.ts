import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: 'A {{label}} típusnak Decimális128 típusúnak kell lennie',
    },
    objectId: {
      must_be_objectId: 'A {{label}} objektumazonosító típusúnak kell lennie',
    },
  },
  mongoose: {
    unsupported_validator: 'Még nem támogatott {{validator}}',
  },
});
