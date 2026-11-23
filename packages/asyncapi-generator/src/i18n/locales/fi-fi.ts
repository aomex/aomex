import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  initialize: 'alustusasiakirja',
  search_channels_files: 'etsi Channel-tiedostoja',
  parse_channels: 'jäsennä Channels',
  hand_fix_documentation: 'Korjaa asiakirjat manuaalisesti',
  save_to_file: 'tallenna tiedostoon',
  validate: 'Tarkista asiakirja',
  help_summary: 'AsyncAPI 3 -dokumentaatiogeneraattori',
  has_error: '{{error_count}}-virheet, {{warning_count}}-varoitukset',
  no_error: 'ei virheitä',
});
