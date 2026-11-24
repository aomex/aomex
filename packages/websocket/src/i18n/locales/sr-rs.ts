import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Неважеће име догађаја',
  invalid_room_name: 'Неважеће име собе',
  unknown_event: 'Непознат догађај: {{event}}',
  handler_error: 'Обрада догађаја није успела',
  duplicate_event: 'Догађај је већ регистрован: {{event}}',
  already_attached: 'WebsocketApp је већ attach, немојте га поново монтирати',
  transport_init_failed: 'Иницијализација WebSocket транспорта није успела',
  handshake_failed: 'WebSocket руковање није успело',
  accept_failed: 'Прихватање везе није успело',
  fanout_deliver_failed: 'Током расподеле упис у {{failed}} веза није успео',
  inbound_task_failed: 'Обрада долазног догађаја није успела',
  error_frame_failed: 'Слање оквира грешке није успело',
  remove_client_failed: 'Уклањање везе није успело',
  close_connection_failed: 'Затварање везе није успело',
  metric_handler_failed: 'Повратни позив метрика није успео',
});
