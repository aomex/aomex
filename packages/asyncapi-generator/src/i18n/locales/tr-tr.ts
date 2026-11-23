import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  initialize: 'başlatma belgesi',
  search_channels_files: 'Channel dosyalarını ara',
  parse_channels: 'Channels ayrıştır',
  hand_fix_documentation: 'Belgeleri manuel olarak onarın',
  save_to_file: 'dosyaya kaydet',
  validate: 'Belgeyi doğrulayın',
  help_summary: 'AsyncAPI 3 belgelendirme oluşturucu',
  has_error: '{{error_count}} hataları, {{warning_count}} uyarıları',
  no_error: 'hata yok',
});
