import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  wrong_type: "La valeur est d'un type incorrect",
  not_integer: "la valeur n'est pas un entier",
  cache_service_destroyed: 'Le service de cache a été détruit',
  single_flight_no_result: "singleFlight n'a pas obtenu de résultat partagé",
});
