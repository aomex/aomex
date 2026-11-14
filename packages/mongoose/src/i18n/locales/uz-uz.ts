import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: "{{label}} Decimal128 turida bo'lishi kerak",
    },
    objectId: {
      must_be_objectId: "{{label}} ObjectId turida bo'lishi kerak",
    },
  },
  mongoose: {
    unsupported_validator: "Hozircha {{validator}} qo'llab-quvvatlanmaydi",
  },
  migration: {
    create: 'Migratsiya faylini yarating',
    up: 'Migratsiyani amalga oshirish',
    down: "Orqaga ko'chirish",
    file_not_found: '"{{file}}" migratsiya fayli mavjud emas',
    input_file_name: 'Migratsiya fayli nomini kiriting:',
    file_created: 'Migratsiya fayli muvaffaqiyatli yaratildi "{{file}}"',
  },
});
