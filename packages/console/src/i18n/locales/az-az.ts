import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" əmri mövcud deyil',
  command_found_recommended:
    '"{{command}}" əmri mövcud deyil. "aomex {{recommended}}" demək istəyirsiniz?',
  help: {
    command: '[əmr]',
    option: '[seçimlər]',
    version: '{{scriptName}} versiya nömrəsini göstərin',
    no_usage: '"{{command}}" əmrinin istifadəsini tapmaq mümkün deyil',
  },
});
