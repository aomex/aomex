import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  command_not_found: 'La commande "{{command}}" n\'existe pas',
  command_found_recommended:
    'La commande "{{command}}" n\'existe pas. Voulez-vous dire "aomex {{recommended}}" ?',
  help: {
    command: '[commande]',
    option: '[options]',
    version: 'Afficher le numéro de version de {{scriptName}}',
    no_usage: 'L\'utilisation de la commande "{{command}}" est introuvable',
  },
});
