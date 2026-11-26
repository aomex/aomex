import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers не можа быць пустым',
  empty_broker: 'brokers змяшчае пусты адрас',
  empty_client_id: 'clientId не можа быць пустым',
  empty_group_id: 'groupId не можа быць пустым',
  empty_topic: 'Назва тэмы не можа быць пустой',
  invalid_topic_name: 'Недапушчальная назва тэмы: {{topic}}',
  topic_name_too_long: 'Назва тэмы занадта доўгая: {{length}} > {{max}}',
  duplicate_topic: 'Тэма зарэгістравана паўторна: {{topic}}',
  mixed_group_id: 'Адзін выклік спажывання можа мець толькі адзін groupId',
  empty_consumers: 'Спажыўцы Kafka не знойдзены',
  already_consuming: 'Спажывец ужо працуе',
  closed: 'Злучэнне Kafka закрыта',
  message_too_large: 'Памер паведамлення перавышае ліміт: {{bytes}} > {{max}}',
  invalid_json: 'Паведамленне не з’яўляецца карэктным JSON',
  empty_message: 'Цела паведамлення пустое',
  encode_failed: 'Не ўдалося закадаваць паведамленне ў JSON',
  unknown_topic: 'Атрымана незапісаная тэма: {{topic}}',
  invalid_offset: 'Недапушчальнае зрушэнне паведамлення: {{offset}}',
  idempotent_requires_all_acks:
    'Пры ўключаным ідэмпатэнтным прадзюсары acks павінны быць -1',
  unsupported_sasl: 'Непадтрымліваны механізм SASL: {{mechanism}}',
  unsupported_tls: 'Канфігурацыю TLS нельга перадаць кліенту: {{name}}',
  heartbeat_exceeds_session: 'Інтэрвал сэрцабіцця павінен быць меншы за тайм-аут сесіі',
});
