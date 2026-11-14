import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" komutu mevcut değil',
  command_found_recommended:
    '"{{command}}" komutu mevcut değil. "aomex {{recommended}}" mi demek istiyorsunuz?',
  help: {
    command: '[komut]',
    option: '[seçenekler]',
    version: '{{scriptName}} sürüm numarasını görüntüle',
    no_usage: '"{{command}}" komutunun kullanımı bulunamadı',
  },
});
