import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ha de ser del tipus Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} ha de ser del tipus ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: "Encara no s'admet {{validator}}",
  },
  migration: {
    create: 'Crea un fitxer de migració',
    up: 'Executar la migració',
    down: 'Migració de retrocés',
    file_not_found: 'El fitxer de migració "{{file}}" no existeix',
    input_file_name: 'Introduïu el nom del fitxer de migració:',
    file_created: 'El fitxer de migració s\'ha creat correctament "{{file}}"',
  },
});
