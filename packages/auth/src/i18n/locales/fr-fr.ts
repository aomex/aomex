import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-fr */
export default I18n.satisfies(zh).define({
  session_create_failed:
    "Impossible de créer la session : plusieurs tentatives d'écriture ont échoué, vérifiez l'adaptateur de stockage",
  session_max_age_invalid: 'cookie.maxAge doit être un nombre positif (en secondes)',
});
