import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  initialize: 'սկզբնավորման փաստաթուղթ',
  search_routers_files: 'Որոնել երթուղային ֆայլեր',
  parse_routers: 'վերլուծել երթուղին',
  add_tag: 'Ավելացնել պիտակ',
  hand_fix_documentation: 'Վերանորոգեք փաստաթղթերը ձեռքով',
  optimize_parameter: 'Օպտիմալացման պարամետրեր',
  save_to_file: 'պահել ֆայլում',
  validate: 'Ստուգեք փաստաթուղթը',
  help_summary: 'OpenAPI v3 փաստաթղթերի գեներատոր',
  help_app_listen_tip:
    'app փոխանցելիս բաժանեք new WebApp-ը և app.listen-ը (կամ listen արեք միայն մուտքի ֆայլում), որպեսզի CLI import-ը կողմնակի ազդեցությամբ չգործարկի սերվերը',
  has_error: '{{error_count}} սխալներ, {{warning_count}} նախազգուշացումներ',
  no_error: 'ոչ մի սխալ',
});
