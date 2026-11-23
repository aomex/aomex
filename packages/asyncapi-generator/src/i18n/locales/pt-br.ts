import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  initialize: 'documento de inicialização',
  search_channels_files: 'pesquisar arquivos Channel',
  parse_channels: 'analisar Channels',
  hand_fix_documentation: 'Reparar documentos manualmente',
  save_to_file: 'salvar em arquivo',
  validate: 'Verificar documento',
  help_summary: 'Gerador de documentação AsyncAPI 3',
  has_error: 'Erros {{error_count}}, avisos {{warning_count}}',
  no_error: 'sem erros',
});
