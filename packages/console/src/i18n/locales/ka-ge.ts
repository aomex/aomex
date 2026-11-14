import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  command_not_found: 'ბრძანება "{{command}}" არ არსებობს',
  command_found_recommended:
    'ბრძანება "{{command}}" არ არსებობს. "aomex {{recommended}}"-ს გულისხმობ?',
  help: {
    command: '[ბრძანება]',
    option: '[პარამეტრები]',
    version: 'აჩვენეთ {{scriptName}} ვერსიის ნომერი',
    no_usage: 'ბრძანების "{{command}}" გამოყენება ვერ მოიძებნა',
  },
});
