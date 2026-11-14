import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} mestilah daripada jenis Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} mestilah jenis ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Belum disokong lagi {{validator}}',
  },
  migration: {
    create: 'Buat fail migrasi',
    up: 'Laksanakan migrasi',
    down: 'Penghijrahan balik',
    file_not_found: 'Fail migrasi "{{file}}" tidak wujud',
    input_file_name: 'Sila masukkan nama fail migrasi:',
    file_created: 'Fail migrasi berjaya dibuat "{{file}}"',
  },
});
