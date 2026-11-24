import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'അസാധുവായ ഇവന്റ് പേര്',
  invalid_room_name: 'അസാധുവായ റൂം പേര്',
  unknown_event: 'അജ്ഞാത ഇവന്റ്: {{event}}',
  handler_error: 'ഇവന്റ് പ്രോസസ്സിംഗ് പരാജയപ്പെട്ടു',
  duplicate_event: 'ഇവന്റ് ഇതിനകം രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്: {{event}}',
  already_attached: 'WebsocketApp ഇതിനകം attach ചെയ്തിട്ടുണ്ട്, വീണ്ടും മൗണ്ട് ചെയ്യരുത്',
  transport_init_failed: 'WebSocket ട്രാൻസ്പോർട്ട് ആരംഭിക്കാനായില്ല',
  handshake_failed: 'WebSocket ഹാൻഡ്ഷേക്ക് പരാജയപ്പെട്ടു',
  accept_failed: 'കണക്ഷൻ സ്വീകരിക്കാനായില്ല',
  fanout_deliver_failed: 'ഫാനൗട്ടിനിടെ {{failed}} കണക്ഷനുകളിലേക്കുള്ള എഴുത്ത് പരാജയപ്പെട്ടു',
  inbound_task_failed: 'ഇൻബൗണ്ട് ഇവന്റ് പ്രോസസ് ചെയ്യാനായില്ല',
  error_frame_failed: 'പിശക് ഫ്രെയിം അയയ്ക്കാനായില്ല',
  remove_client_failed: 'കണക്ഷൻ നീക്കം ചെയ്യാനായില്ല',
  close_connection_failed: 'കണക്ഷൻ അടയ്ക്കാനായില്ല',
  metric_handler_failed: 'മെട്രിക് കോൾബാക്ക് പരാജയപ്പെട്ടു',
});
