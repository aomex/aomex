import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'عندما تكون credentials هي true يجب تعيين origin صراحةً (أصل محدد أو قائمة سماح أو دالة تُرجع أصلاً محدداً)؛ الانعكاس الافتراضي غير مسموح',
  credentials_with_wildcard_origin:
    'لا يمكن أن يكون origin هو "*" عندما تكون credentials هي true: المتصفحات ترفض هذا الجمع؛ استخدم أصلاً محدداً أو قائمة سماح أو دالة تُرجع أصلاً محدداً',
});
