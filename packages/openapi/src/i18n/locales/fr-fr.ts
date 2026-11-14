import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  initialize: "document d'initialisation",
  search_routers_files: 'Rechercher des fichiers de routage',
  parse_routers: "analyser l'itinéraire",
  add_tag: 'Ajouter une balise',
  hand_fix_documentation: 'Réparer les documents manuellement',
  optimize_parameter: "Paramètres d'optimisation",
  save_to_file: 'enregistrer dans un fichier',
  validate: 'Vérifier le document',
  help_summary: 'Générateur de documentation OpenAPI v3',
  has_error: 'Erreurs {{error_count}}, avertissements {{warning_count}}',
  no_error: 'aucune erreur',
});
