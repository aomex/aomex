import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  command_not_found: 'Komentoa "{{command}}" ei ole olemassa',
  command_found_recommended:
    'Komentoa "{{command}}" ei ole olemassa. Tarkoitatko "aomex {{recommended}}"?',
  help: {
    command: '[komento]',
    option: '[vaihtoehdot]',
    version: 'Näytä {{scriptName}}:n versionumero',
    no_usage: 'Komennon "{{command}}" käyttöä ei löydy',
  },
});
