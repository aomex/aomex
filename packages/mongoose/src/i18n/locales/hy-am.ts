import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}}-ը պետք է լինի տասնորդական128 տեսակի',
    },
    objectId: {
      must_be_objectId: '{{label}}-ը պետք է լինի ObjectId տեսակի',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} դեռ չի աջակցվում',
  },
  migration: {
    create: 'Ստեղծեք միգրացիոն ֆայլ',
    up: 'Կատարել միգրացիա',
    down: 'Հետադարձ միգրացիա',
    file_not_found: '«{{file}}» միգրացիոն ֆայլը գոյություն չունի',
    input_file_name: 'Խնդրում ենք մուտքագրել միգրացիոն ֆայլի անունը.',
    file_created: 'Միգրացիոն ֆայլը հաջողությամբ ստեղծվել է «{{file}}»',
  },
});
