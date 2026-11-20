import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'apabila credentials ialah true, origin mesti dikonfigurasi secara eksplisit (origin konkrit, senarai putih, atau fungsi yang mengembalikan origin konkrit); pantulan lalai dilarang',
  credentials_with_wildcard_origin:
    'apabila credentials ialah true, origin tidak boleh "*": pelayar menolak gabungan ini; gunakan origin konkrit, senarai putih, atau fungsi yang mengembalikan origin konkrit',
});
