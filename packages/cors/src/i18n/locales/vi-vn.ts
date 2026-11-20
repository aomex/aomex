import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'khi credentials là true phải cấu hình origin tường minh (nguồn cụ thể, danh sách trắng hoặc hàm trả về nguồn cụ thể); cấm phụ thuộc phản xạ mặc định',
  credentials_with_wildcard_origin:
    'khi credentials là true thì origin không được là "*": trình duyệt không chấp nhận tổ hợp này; hãy đổi thành nguồn cụ thể, danh sách trắng hoặc hàm trả về nguồn cụ thể',
});
