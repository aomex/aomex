import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'kad je credentials true, origin mora biti eksplicitno postavljen (konkretan origin, popis dopuštenih ili funkcija koja vraća konkretan origin); zadano odbijanje nije dopušteno',
  credentials_with_wildcard_origin:
    'kad je credentials true, origin ne smije biti "*": preglednici ne prihvaćaju tu kombinaciju; koristite konkretan origin, popis dopuštenih ili funkciju koja vraća konkretan origin',
});
