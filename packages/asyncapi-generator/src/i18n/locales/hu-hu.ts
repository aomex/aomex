import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  initialize: 'inicializálási dokumentum',
  search_channels_files: 'Channel fájlok keresése',
  parse_channels: 'Channels elemzése',
  hand_fix_documentation: 'A dokumentumok manuális javítása',
  save_to_file: 'fájlba menteni',
  validate: 'Igazolja a dokumentumot',
  help_summary: 'AsyncAPI 3 dokumentációgenerátor',
  has_error: '{{error_count}} hibák, {{warning_count}} figyelmeztetések',
  no_error: 'nincsenek hibák',
});
