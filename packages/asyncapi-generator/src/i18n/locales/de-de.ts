import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  initialize: 'Initialisierungsdokument',
  search_channels_files: 'Channel-Dateien suchen',
  parse_channels: 'Channels parsen',
  hand_fix_documentation: 'Dokumente manuell reparieren',
  save_to_file: 'in Datei speichern',
  validate: 'Dokument überprüfen',
  help_summary: 'AsyncAPI 3-Dokumentationsgenerator',
  has_error: '{{error_count}}-Fehler, {{warning_count}}-Warnungen',
  no_error: 'keine Fehler',
});
