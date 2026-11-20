import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-az */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Sesiyanı yaratmaq mümkün olmadı: bir neçə yazma cəhdi uğursuz oldu, saxlama adapterini yoxlayın',
  session_max_age_invalid: 'cookie.maxAge müsbət ədəd olmalıdır (saniyə ilə)',
});
