import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'kui credentials on true, peab origin olema selgelt määratud (konkreetne origin, lubatud loend või konkreetse origini tagastav funktsioon); vaikereflektsioon pole lubatud',
  credentials_with_wildcard_origin:
    'kui credentials on true, ei tohi origin olla "*": brauserid ei aktsepteeri seda kombinatsiooni; kasutage konkreetset originit, lubatud loendit või funktsiooni, mis tagastab konkreetse origini',
});
