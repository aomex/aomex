import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} deve essere di tipo Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} deve essere di tipo ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Non ancora supportato {{validator}}',
  },
  migration: {
    create: 'Crea file di migrazione',
    up: 'Eseguire la migrazione',
    down: 'Migrazione di ripristino',
    file_not_found: 'Il file di migrazione "{{file}}" non esiste',
    input_file_name: 'Inserisci il nome del file di migrazione:',
    file_created: 'Il file di migrazione è stato creato correttamente "{{file}}"',
  },
});
