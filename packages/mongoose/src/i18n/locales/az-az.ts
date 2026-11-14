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
  migration: {
    create: 'Miqrasiya faylı yaradın',
    up: 'Miqrasiyanı həyata keçirin',
    down: 'Geriyə miqrasiya',
    file_not_found: '"{{file}}" miqrasiya faylı mövcud deyil',
    input_file_name: 'Miqrasiya faylının adını daxil edin:',
    file_created: '"{{file}}" miqrasiya faylı uğurla yaradıldı',
  },
});
