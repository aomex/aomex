import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} harus bertipe Desimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} harus bertipe ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Belum didukung {{validator}}',
  },
  migration: {
    create: 'Buat file migrasi',
    up: 'Jalankan migrasi',
    down: 'Migrasi kembalikan',
    file_not_found: 'File migrasi "{{file}}" tidak ada',
    input_file_name: 'Silakan masukkan nama file migrasi:',
    file_created: 'File migrasi berhasil dibuat "{{file}}"',
  },
});
