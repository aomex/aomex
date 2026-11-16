import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  initialize: 'بەڵگەنامەی دەستپێکردن',
  search_routers_files: 'گەڕان بەدوای فایلەکانی ڕێڕەودا',
  parse_routers: 'ڕێڕەوی شیکردنەوە',
  add_tag: 'تاگ زیاد بکە',
  hand_fix_documentation: 'بەڵگەنامەکان بە دەستی چاک بکەرەوە',
  optimize_parameter: 'پارامێتەرەکانی باشکردن',
  save_to_file: 'پاشەکەوت بکە بۆ فایل',
  validate: 'بەڵگەنامە پشتڕاست بکەرەوە',
  help_summary: 'مۆلیدەی بەڵگەنامەی OpenAPI v3',
  help_app_listen_tip:
    'کاتێک app دەنێریت، new WebApp و app.listen جیا بکەوە (یان تەنها لە فایلی دەروازە listen بکە) بۆ ئەوەی importی CLI سێرڤەر وەک کاریگەری لاوەکی دەستپێنەکات',
  has_error: 'هەڵەکانی {{error_count}}، ئاگادارکردنەوەکانی {{warning_count}}',
  no_error: 'هیچ هەڵەیەک نییە',
});
