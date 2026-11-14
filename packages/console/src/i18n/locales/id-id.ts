import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  command_not_found: 'Perintah "{{command}}" tidak ada',
  command_found_recommended:
    'Perintah "{{command}}" tidak ada. Maksudnya "aomex {{recommended}}"?',
  help: {
    command: '[perintah]',
    option: '[pilihan]',
    version: 'Tampilkan nomor versi {{scriptName}}',
    no_usage: 'Penggunaan perintah "{{command}}" tidak dapat ditemukan',
  },
});
