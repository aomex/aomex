import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  initialize: 'initsialiseerimisdokument',
  search_routers_files: 'Otsige marsruutimisfaile',
  parse_routers: 'sõeluda marsruuti',
  add_tag: 'Lisa silt',
  hand_fix_documentation: 'Parandage dokumendid käsitsi',
  optimize_parameter: 'Optimeerimise parameetrid',
  save_to_file: 'faili salvestada',
  validate: 'Kinnitage dokument',
  help_summary: 'OpenAPI v3 dokumentatsiooni generaator',
  help_app_listen_tip:
    'Eraldage new WebApp ja app.listen (või kuulake ainult sisenemisfailis), et CLI import ei käivitaks serverit kõrvalmõjuna',
  has_error: '{{error_count}} vead, {{warning_count}} hoiatused',
  no_error: 'vigu pole',
});
