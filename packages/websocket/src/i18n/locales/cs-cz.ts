import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Neplatný název události',
  invalid_room_name: 'Neplatný název místnosti',
  unknown_event: 'Neznámá událost: {{event}}',
  handler_error: 'Zpracování události selhalo',
  duplicate_event: 'Událost je již zaregistrována: {{event}}',
  already_attached: 'WebsocketApp je již attach, nepřipojujte znovu',
  transport_init_failed: 'Inicializace WebSocket transportu selhala',
  handshake_failed: 'WebSocket handshake selhal',
  accept_failed: 'Přijetí spojení selhalo',
  fanout_deliver_failed: 'Při fanoutu selhal zápis u {{failed}} spojení',
  inbound_task_failed: 'Zpracování příchozí události selhalo',
  error_frame_failed: 'Odeslání chybového rámce selhalo',
  remove_client_failed: 'Odebrání spojení selhalo',
  close_connection_failed: 'Uzavření spojení selhalo',
  metric_handler_failed: 'Callback metrik selhal',
});
