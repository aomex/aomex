import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  command_not_found: 'Kommandot "{{command}}" finns inte',
  command_found_recommended:
    'Kommandot "{{command}}" finns inte. Menar du "aomex {{recommended}}"?',
  help: {
    command: '[kommando]',
    option: '[alternativ]',
    version: 'Visa versionsnumret för {{scriptName}}',
    no_usage: 'Användningen av kommandot "{{command}}" kan inte hittas',
  },
});
