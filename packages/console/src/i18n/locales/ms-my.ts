import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  command_not_found: 'Perintah "{{command}}" tidak wujud',
  command_found_recommended:
    'Perintah "{{command}}" tidak wujud. Adakah anda maksudkan "aomex {{recommended}}"?',
  help: {
    command: '[perintah]',
    option: '[pilihan]',
    version: 'Paparkan nombor versi {{scriptName}}',
    no_usage: 'Penggunaan arahan "{{command}}" tidak dapat ditemui',
  },
});
