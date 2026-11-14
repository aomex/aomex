import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  command_not_found: 'Komanda „{{command}}“ neegzistuoja',
  command_found_recommended:
    'Komanda „{{command}}“ neegzistuoja. Ar turite omenyje "aomex {{recommended}}"?',
  help: {
    command: '[komanda]',
    option: '[parinktys]',
    version: 'Rodyti {{scriptName}} versijos numerį',
    no_usage: 'Nepavyko rasti komandos „{{command}}“ naudojimo',
  },
});
