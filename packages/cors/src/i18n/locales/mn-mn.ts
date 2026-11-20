import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true үед origin-ийг тодорхой тохируулах ёстой (тодорхой origin, цагаан жагсаалт эсвэл тодорхой origin буцаадаг функц); үндсэн тусгал хориотой',
  credentials_with_wildcard_origin:
    'credentials true үед origin "*" байж болохгүй: хөтөч энэ хослолыг хүлээн зөвшөөрдөггүй; тодорхой origin, цагаан жагсаалт эсвэл тодорхой origin буцаадаг функц ашиглана уу',
});
