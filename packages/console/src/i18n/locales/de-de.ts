import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  command_not_found: 'Der Befehl „{{command}}“ existiert nicht',
  command_found_recommended:
    'Der Befehl „{{command}}“ existiert nicht. Meinst du „aomex {{recommended}}“?',
  help: {
    command: '[Befehl]',
    option: '[Optionen]',
    version: 'Zeigt die Versionsnummer von {{scriptName}} an',
    no_usage: 'Die Verwendung des Befehls „{{command}}“ kann nicht gefunden werden',
  },
});
