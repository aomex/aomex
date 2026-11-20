import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true হলে origin স্পষ্টভাবে সেট করতে হবে (নির্দিষ্ট origin, সাদা তালিকা, বা নির্দিষ্ট origin ফেরত দেওয়া ফাংশন); ডিফল্ট প্রতিফলন অনুমোদিত নয়',
  credentials_with_wildcard_origin:
    'credentials true হলে origin "*" হতে পারে না: ব্রাউজার এই সংমিশ্রণ গ্রহণ করে না; নির্দিষ্ট origin, সাদা তালিকা, বা নির্দিষ্ট origin ফেরত দেওয়া ফাংশন ব্যবহার করুন',
});
