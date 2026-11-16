import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  initialize: 'başlatma belgesi',
  search_routers_files: 'Yönlendirme dosyalarını arayın',
  parse_routers: 'rotayı ayrıştır',
  add_tag: 'Etiket ekle',
  hand_fix_documentation: 'Belgeleri manuel olarak onarın',
  optimize_parameter: 'Optimizasyon parametreleri',
  save_to_file: 'dosyaya kaydet',
  validate: 'Belgeyi doğrulayın',
  help_summary: 'OpenAPI v3 dokümantasyon oluşturucu',
  help_app_listen_tip:
    'app geçirirken new WebApp ile app.listen’i ayırın (veya yalnızca giriş dosyasında listen edin); böylece CLI import’u sunucuyu yan etki olarak başlatmaz',
  has_error: '{{error_count}} hataları, {{warning_count}} uyarıları',
  no_error: 'hata yok',
});
