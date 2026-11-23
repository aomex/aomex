import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  initialize: 'hasierako dokumentua',
  search_channels_files: 'bilatu Channel fitxategiak',
  parse_channels: 'Channel-ak analizatu',
  hand_fix_documentation: 'Dokumentuak eskuz konpondu',
  save_to_file: 'gorde fitxategian',
  validate: 'Egiaztatu dokumentua',
  help_summary: 'AsyncAPI 3 dokumentazio-sortzailea',
  has_error: '{{error_count}} akatsak, {{warning_count}} abisuak',
  no_error: 'akatsik ez',
});
