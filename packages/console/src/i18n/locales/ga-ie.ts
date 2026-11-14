import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  command_not_found: 'Níl an t-ordú "{{command}}" ann',
  command_found_recommended:
    'Níl an t-ordú "{{command}}" ann. An bhfuil "aomex {{recommended}}" i gceist agat?',
  help: {
    command: '[ordú]',
    option: '[roghanna]',
    version: 'Taispeáin uimhir leagain {{scriptName}}',
    no_usage: 'Ní féidir úsáid an ordaithe "{{command}}" a aimsiú',
  },
});
