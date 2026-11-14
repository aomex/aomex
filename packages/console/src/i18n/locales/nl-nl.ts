import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  command_not_found: 'Het commando "{{command}}" bestaat niet',
  command_found_recommended:
    'Het commando "{{command}}" bestaat niet. Bedoelt u \'aomex {{recommended}}\'?',
  help: {
    command: '[opdracht]',
    option: '[opties]',
    version: 'Geef het versienummer van {{scriptName}} weer',
    no_usage: 'Het gebruik van het commando "{{command}}" kan niet worden gevonden',
  },
});
