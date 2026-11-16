import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  initialize: 'documento di inizializzazione',
  search_routers_files: 'Cerca file di routing',
  parse_routers: 'analizzare il percorso',
  add_tag: 'Aggiungi etichetta',
  hand_fix_documentation: 'Riparare i documenti manualmente',
  optimize_parameter: 'Parametri di ottimizzazione',
  save_to_file: 'salvare su file',
  validate: 'Verifica documento',
  help_summary: 'Generatore di documentazione OpenAPI v3',
  help_app_listen_tip:
    'Separa new WebApp da app.listen (o fai listen solo nel file di ingresso) per evitare che l’import CLI avvii il server come effetto collaterale',
  has_error: 'Errori {{error_count}}, avvisi {{warning_count}}',
  no_error: 'nessun errore',
});
