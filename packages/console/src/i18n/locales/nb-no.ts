import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  command_not_found: 'Kommandoen "{{command}}" eksisterer ikke',
  command_found_recommended:
    'Kommandoen "{{command}}" eksisterer ikke. Mener du "aomex {{recommended}}"?',
  help: {
    command: '[kommando]',
    option: '[alternativer]',
    version: 'Vis versjonsnummeret til {{scriptName}}',
    no_usage: 'Bruken av kommandoen "{{command}}" ble ikke funnet',
  },
});
