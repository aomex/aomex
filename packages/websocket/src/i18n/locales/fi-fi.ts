import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Virheellinen tapahtuman nimi',
  invalid_room_name: 'Virheellinen huoneen nimi',
  unknown_event: 'Tuntematon tapahtuma: {{event}}',
  handler_error: 'Tapahtuman käsittely epäonnistui',
  duplicate_event: 'Tapahtuma on jo rekisteröity: {{event}}',
  already_attached: 'WebsocketApp on jo attach, älä liitä uudelleen',
  transport_init_failed: 'WebSocket-siirron alustus epäonnistui',
  handshake_failed: 'WebSocket-kättely epäonnistui',
  accept_failed: 'Yhteyden hyväksyminen epäonnistui',
  fanout_deliver_failed: '{{failed}} yhteyskirjoitusta epäonnistui fanoutin aikana',
  inbound_task_failed: 'Saapuvan tapahtuman käsittely epäonnistui',
  error_frame_failed: 'Virhekehyksen lähetys epäonnistui',
  remove_client_failed: 'Yhteyden poistaminen epäonnistui',
  close_connection_failed: 'Yhteyden sulkeminen epäonnistui',
  metric_handler_failed: 'Mittarikutsun käsittely epäonnistui',
});
