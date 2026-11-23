import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  initialize: "document d'initialisation",
  search_channels_files: 'rechercher les fichiers Channel',
  parse_channels: 'analyser les Channels',
  hand_fix_documentation: 'Réparer les documents manuellement',
  save_to_file: 'enregistrer dans un fichier',
  validate: 'Vérifier le document',
  help_summary: 'Générateur de documentation AsyncAPI 3',
  has_error: 'Erreurs {{error_count}}, avertissements {{warning_count}}',
  no_error: 'aucune erreur',
});
