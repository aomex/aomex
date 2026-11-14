import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  command_not_found: 'Каманда "{{command}}" не існуе',
  command_found_recommended:
    'Каманда "{{command}}" не існуе. Вы маеце на ўвазе "aomex {{recommended}}"?',
  help: {
    command: '[каманда]',
    option: '[Параметры]',
    version: 'Паказаць нумар версіі {{scriptName}}',
    no_usage: 'Выкарыстанне каманды "{{command}}" не знойдзена',
  },
});
