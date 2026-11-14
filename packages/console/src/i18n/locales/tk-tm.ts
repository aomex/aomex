import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" buýrugy ýok',
  command_found_recommended:
    '"{{command}}" buýrugy ýok. "Aomex {{recommended}}" diýjek bolýarsyňyzmy?',
  help: {
    command: '[buýruk]',
    option: '[opsiýalar]',
    version: '{{scriptName}} wersiýa belgisini görkeziň',
    no_usage: '"{{command}}" buýrugynyň ulanylyşyny tapyp bolmaýar',
  },
});
