import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  command_not_found: 'Komanda "{{command}}" neeksistē',
  command_found_recommended:
    'Komanda "{{command}}" neeksistē. Vai jūs domājat "aomex {{recommended}}"?',
  help: {
    command: '[komanda]',
    option: '[opcijas]',
    version: 'Parādiet {{scriptName}} versijas numuru',
    no_usage: 'Komandas "{{command}}" lietojumu nevar atrast',
  },
});
