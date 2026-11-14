import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  command_not_found: 'Käsku "{{command}}" pole olemas',
  command_found_recommended:
    'Käsku "{{command}}" pole olemas. Kas mõtlete "aomex {{recommended}}"?',
  help: {
    command: '[käsk]',
    option: '[valikud]',
    version: 'Kuvage {{scriptName}} versiooninumber',
    no_usage: 'Käsu "{{command}}" kasutamist ei leitud',
  },
});
