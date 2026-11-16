import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  initialize: 'documento de inicialização',
  search_routers_files: 'Pesquisar arquivos de roteamento',
  parse_routers: 'analisar rota',
  add_tag: 'Adicionar etiqueta',
  hand_fix_documentation: 'Reparar documentos manualmente',
  optimize_parameter: 'Parâmetros de otimização',
  save_to_file: 'salvar em arquivo',
  validate: 'Verificar documento',
  help_summary: 'Gerador de documentação OpenAPI v3',
  help_app_listen_tip:
    'Separe new WebApp de app.listen (ou faça listen só no arquivo de entrada) para evitar que o import do CLI inicie o servidor como efeito colateral',
  has_error: 'Erros {{error_count}}, avisos {{warning_count}}',
  no_error: 'sem erros',
});
