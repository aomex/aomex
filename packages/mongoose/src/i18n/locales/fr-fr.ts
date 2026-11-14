import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} doit être de type Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} doit être de type ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Pas encore pris en charge {{validator}}',
  },
  migration: {
    create: 'Créer un fichier de migration',
    up: 'Exécuter la migration',
    down: 'Annulation de la migration',
    file_not_found: 'Le fichier de migration "{{file}}" n\'existe pas',
    input_file_name: 'Veuillez saisir le nom du fichier de migration :',
    file_created: 'Le fichier de migration a été créé avec succès "{{file}}"',
  },
});
