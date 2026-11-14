import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-PT */
export default I18n.satisfies(zh).define({
  command_not_found: 'O comando "{{command}}" não existe',
  command_found_recommended:
    'O comando "{{command}}" não existe. Você quer dizer "aomex {{recommended}}"?',
  help: {
    command: '[comando]',
    option: '[opções]',
    version: 'Exibir o número da versão do {{scriptName}}',
    no_usage: 'O uso do comando "{{command}}" não foi encontrado',
  },
});
