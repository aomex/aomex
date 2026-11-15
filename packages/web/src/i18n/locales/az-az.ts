import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} fayl olmalıdır',
      too_large: '{{label}} faylı çox böyükdür',
      unsupported_mimetype: '{{label}} fayl növü dəstəklənmir',
      invalid_mimetype_token: 'Yanlış media növü və ya fayl uzantısı: {{token}}',
    },
  },
  response: {
    redirect: '{{url}} ünvanına yönləndirilir',
  },
});
