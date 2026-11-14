import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} Hamartar128 motakoa izan behar du',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId motakoa izan behar du',
    },
  },
  mongoose: {
    unsupported_validator: 'Oraindik ez da onartzen {{validator}}',
  },
  migration: {
    create: 'Sortu migrazio fitxategia',
    up: 'Migrazioa exekutatu',
    down: 'Atzerako migrazioa',
    file_not_found: '"{{file}}" migrazio fitxategia ez dago',
    input_file_name: 'Mesedez, idatzi migrazio-fitxategiaren izena:',
    file_created: 'Migrazio fitxategia behar bezala sortu da "{{file}}"',
  },
});
