import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'lorsque credentials est true, origin doit être défini explicitement (origine concrète, liste blanche ou fonction renvoyant une origine concrète) ; la réflexion par défaut est interdite',
  credentials_with_wildcard_origin:
    'origin ne peut pas être "*" lorsque credentials est true : les navigateurs rejettent cette combinaison ; utilisez une origine concrète, une liste blanche ou une fonction qui renvoie une origine concrète',
});
