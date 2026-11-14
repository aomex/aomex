import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}}, Decimal128 türünde olmalıdır',
    },
    objectId: {
      must_be_objectId: '{{label}}, ObjectId türünde olmalıdır',
    },
  },
  mongoose: {
    unsupported_validator: 'Henüz desteklenmiyor {{validator}}',
  },
  migration: {
    create: 'Taşıma dosyası oluştur',
    up: 'Taşımayı yürüt',
    down: 'Geri alma geçişi',
    file_not_found: '"{{file}}" geçiş dosyası mevcut değil',
    input_file_name: 'Lütfen taşıma dosyasının adını girin:',
    file_created: 'Taşıma dosyası başarıyla oluşturuldu "{{file}}"',
  },
});
