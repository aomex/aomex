import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Няправільная назва падзеі',
  invalid_room_name: 'Няправільная назва пакоя',
  unknown_event: 'Невядомая падзея: {{event}}',
  handler_error: 'Не ўдалося апрацаваць падзею',
  duplicate_event: 'Падзея ўжо зарэгістравана: {{event}}',
  already_attached: 'WebsocketApp ужо attach, не падключайце паўторна',
  transport_init_failed: 'Не ўдалося ініцыялізаваць транспарт WebSocket',
  handshake_failed: 'Не ўдалося выканаць поціск рукі WebSocket',
  accept_failed: 'Не ўдалося прыняць злучэнне',
  fanout_deliver_failed: 'Падчас рассылкі не ўдалося запісаць у {{failed}} злучэнняў',
  inbound_task_failed: 'Не ўдалося апрацаваць уваходную падзею',
  error_frame_failed: 'Не ўдалося адправіць кадр памылкі',
  remove_client_failed: 'Не ўдалося выдаліць злучэнне',
  close_connection_failed: 'Не ўдалося закрыць злучэнне',
  metric_handler_failed: 'Збой апрацоўшчыка метрык',
});
