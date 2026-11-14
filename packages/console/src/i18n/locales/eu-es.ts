import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" komandoa ez dago',
  command_found_recommended:
    '"{{command}}" komandoa ez dago. "aomex {{recommended}}" esan nahi al duzu?',
  help: {
    command: '[agindua]',
    option: '[aukerak]',
    version: 'Bistaratu {{scriptName}}ren bertsio-zenbakia',
    no_usage: 'Ezin da aurkitu "{{command}}" komandoaren erabilera',
  },
});
