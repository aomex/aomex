import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  command_not_found: 'Kommandoen "{{command}}" eksisterer ikke',
  command_found_recommended:
    'Kommandoen "{{command}}" eksisterer ikke. Mener du "aomex {{recommended}}"?',
  help: {
    command: '[kommando]',
    option: '[valgmuligheder]',
    version: 'Vis versionsnummeret for {{scriptName}}',
    no_usage: 'Brugen af kommandoen "{{command}}" kan ikke findes',
  },
});
