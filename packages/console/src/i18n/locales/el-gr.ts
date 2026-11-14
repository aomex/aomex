import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  command_not_found: 'Η εντολή "{{command}}" δεν υπάρχει',
  command_found_recommended:
    'Η εντολή "{{command}}" δεν υπάρχει. Εννοείς "aomex {{recommended}}";',
  help: {
    command: '[εντολή]',
    option: '[επιλογές]',
    version: 'Εμφανίστε τον αριθμό έκδοσης του {{scriptName}}',
    no_usage: 'Δεν μπορεί να βρεθεί η χρήση της εντολής "{{command}}".',
  },
});
