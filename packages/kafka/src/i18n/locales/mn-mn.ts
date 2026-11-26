import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers хоосон байж болохгүй',
  empty_broker: 'brokers хоосон хаяг агуулж байна',
  empty_client_id: 'clientId хоосон байж болохгүй',
  empty_group_id: 'groupId хоосон байж болохгүй',
  empty_topic: 'Сэдвийн нэр хоосон байж болохгүй',
  invalid_topic_name: 'Буруу сэдвийн нэр: {{topic}}',
  topic_name_too_long: 'Сэдвийн нэр хэт урт байна: {{length}} > {{max}}',
  duplicate_topic: 'Сэдэв нэгээс олон удаа бүртгэгдсэн: {{topic}}',
  mixed_group_id: 'Нэг consume дуудлагад зөвхөн нэг groupId байж болно',
  empty_consumers: 'Kafka хэрэглэгч олдсонгүй',
  already_consuming: 'Хэрэглэгч аль хэдийн ажиллаж байна',
  closed: 'Kafka холболт хаагдсан',
  message_too_large: 'Зурвасын хэмжээ хязгаараас хэтэрсэн: {{bytes}} > {{max}}',
  invalid_json: 'Зурвас хүчинтэй JSON биш',
  empty_message: 'Зурвасын бие хоосон',
  encode_failed: 'Зурвасыг JSON болгон кодлож чадсангүй',
  unknown_topic: 'Захиалаагүй сэдэв хүлээн авсан: {{topic}}',
  invalid_offset: 'Буруу зурвасын офсет: {{offset}}',
  idempotent_requires_all_acks: 'Идемпотент продюсер асаалттай үед acks -1 байх ёстой',
  unsupported_sasl: 'Дэмжигдээгүй SASL механизм: {{mechanism}}',
  unsupported_tls: 'TLS сонголтыг клиентэд дамжуулах боломжгүй: {{name}}',
  heartbeat_exceeds_session:
    'Зүрхний цохилтын интервал сессийн хугацаанаас бага байх ёстой',
});
