import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  initialize: 'initialisatiedocument',
  search_channels_files: 'Channel-bestanden zoeken',
  parse_channels: 'Channels parsen',
  hand_fix_documentation: 'Documenten handmatig repareren',
  save_to_file: 'opslaan in bestand',
  validate: 'Document verifiëren',
  help_summary: 'AsyncAPI 3-documentatiegenerator',
  has_error: '{{error_count}}-fouten, {{warning_count}}-waarschuwingen',
  no_error: 'geen fouten',
});
