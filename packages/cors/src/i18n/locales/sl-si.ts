import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'ko je credentials true, mora biti origin eksplicitno nastavljen (konkreten origin, bela lista ali funkcija, ki vrne konkreten origin); privzeto zrcaljenje ni dovoljeno',
  credentials_with_wildcard_origin:
    'ko je credentials true, origin ne sme biti "*": brskalniki te kombinacije ne sprejmejo; uporabite konkreten origin, belo listo ali funkcijo, ki vrne konkreten origin',
});
