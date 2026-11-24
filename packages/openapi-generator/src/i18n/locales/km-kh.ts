import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  initialize: 'ឯកសារចាប់ផ្តើម',
  search_routers_files: 'ស្វែងរកឯកសារកំណត់ផ្លូវ',
  parse_routers: 'ផ្លូវញែក',
  add_tag: 'បន្ថែមស្លាក',
  hand_fix_documentation: 'ជួសជុលឯកសារដោយដៃ',
  optimize_parameter: 'ប៉ារ៉ាម៉ែត្របង្កើនប្រសិទ្ធភាព',
  save_to_file: 'រក្សាទុកក្នុងឯកសារ',
  validate: 'ផ្ទៀងផ្ទាត់ឯកសារ',
  help_summary: 'កម្មវិធីបង្កើតឯកសារ OpenAPI v3',
  help_app_listen_tip:
    'សូមបំបែក new WebApp ពី app.listen (ឬ listen តែនៅក្នុងឯកសារចូល) ដើម្បីជៀសវាងការបញ្ចូល CLI ចាប់ផ្តើមម៉ាស៊ីនមេជាផលប៉ះពាល់ចំហៀង',
  has_error: 'កំហុស {{error_count}} ការព្រមាន {{warning_count}}',
  no_error: 'គ្មាន​កំហុស',
});
