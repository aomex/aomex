import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  initialize: 'سند اولیه',
  search_routers_files: 'جستجوی فایل های مسیریابی',
  parse_routers: 'تجزیه مسیر',
  add_tag: 'برچسب اضافه کنید',
  hand_fix_documentation: 'اسناد را به صورت دستی تعمیر کنید',
  optimize_parameter: 'پارامترهای بهینه سازی',
  save_to_file: 'ذخیره در فایل',
  validate: 'تایید سند',
  help_summary: 'مولد اسناد OpenAPI v3',
  help_app_listen_tip:
    'هنگام ارسال app، new WebApp را از app.listen جدا کنید (یا فقط در فایل ورودی listen کنید) تا import مربوط به CLI سرور را به‌عنوان اثر جانبی راه‌اندازی نکند',
  has_error: 'خطاهای {{error_count}}، هشدارهای {{warning_count}}',
  no_error: 'بدون خطا',
});
