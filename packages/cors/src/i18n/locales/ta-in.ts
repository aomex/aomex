import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true ஆக இருக்கும்போது origin தெளிவாக அமைக்கப்பட வேண்டும் (குறிப்பிட்ட origin, அனுமதிப்பட்டியல் அல்லது குறிப்பிட்ட origin திருப்பும் செயல்பாடு); இயல்புநிலை பிரதிபலிப்பு அனுமதிக்கப்படாது',
  credentials_with_wildcard_origin:
    'credentials true ஆக இருக்கும்போது origin "*" ஆக இருக்கக்கூடாது: உலாவிகள் இந்த இணைப்பை ஏற்காது; குறிப்பிட்ட origin, அனுமதிப்பட்டியல் அல்லது குறிப்பிட்ட origin திருப்பும் செயல்பாட்டைப் பயன்படுத்தவும்',
});
