import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kmr-IQ */
export default I18n.satisfies(zh).define({
  command_not_found: 'Fermana "{{command}}" tune',
  command_found_recommended:
    'Fermana "{{command}}" tune. Ma hûn dibêjin "aomex {{recommended}}"?',
  help: {
    command: '[ferman]',
    option: '[vebijark]',
    version: 'Hejmara guhertoya {{scriptName}} nîşan bide',
    no_usage: 'Bikaranîna fermana "{{command}}" nayê dîtin',
  },
});
