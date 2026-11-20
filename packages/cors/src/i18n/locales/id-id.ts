import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'saat credentials true, origin harus dikonfigurasi secara eksplisit (origin konkret, daftar putih, atau fungsi yang mengembalikan origin konkret); refleksi default dilarang',
  credentials_with_wildcard_origin:
    'saat credentials true, origin tidak boleh "*": browser menolak kombinasi ini; gunakan origin konkret, daftar putih, atau fungsi yang mengembalikan origin konkret',
});
