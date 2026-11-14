import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} deve ser do tipo Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} deve ser do tipo ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Ainda não suportado {{validator}}',
  },
  migration: {
    create: 'Criar arquivo de migração',
    up: 'Executar migração',
    down: 'Migração de reversão',
    file_not_found: 'O arquivo de migração "{{file}}" não existe',
    input_file_name: 'Insira o nome do arquivo de migração:',
    file_created: 'O arquivo de migração foi criado com sucesso "{{file}}"',
  },
});
