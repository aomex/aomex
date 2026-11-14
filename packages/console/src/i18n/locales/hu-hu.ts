import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  command_not_found: 'A "{{command}}" parancs nem létezik',
  command_found_recommended:
    'A "{{command}}" parancs nem létezik. Az "aomex {{recommended}}"-re gondol?',
  help: {
    command: '[parancs]',
    option: '[opciók]',
    version: 'Jelenítse meg a {{scriptName}} verziószámát',
    no_usage: 'A "{{command}}" parancs használata nem található',
  },
});
